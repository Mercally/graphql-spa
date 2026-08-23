using System.Text;
using System.Text.Json;
using WorkMvc.Services.Backend;

namespace WorkMvc.Services.GraphQl;

/// <summary>
/// Lightweight GraphQL client: POSTs a raw query string + variables to /graphql and parses
/// the standard { data, errors } envelope. No heavy client library (StrawberryShake, etc.)
/// is needed for a PoC that only reads - a few lines of HttpClient + System.Text.Json cover
/// it, per the task brief.
/// </summary>
public interface IGraphQlGateway
{
    Task<JsonElement> ExecuteAsync(string query, object? variables = null, string? operationLabel = null);
}

public class GraphQlGateway : IGraphQlGateway
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IBackendContext _backendContext;
    private readonly IRequestCounter _counter;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public GraphQlGateway(IHttpClientFactory httpClientFactory, IBackendContext backendContext, IRequestCounter counter)
    {
        _httpClientFactory = httpClientFactory;
        _backendContext = backendContext;
        _counter = counter;
    }

    public async Task<JsonElement> ExecuteAsync(string query, object? variables = null, string? operationLabel = null)
    {
        var client = _httpClientFactory.CreateClient("GraphQl");
        var payload = JsonSerializer.Serialize(new { query, variables }, JsonOptions);
        _counter.Record($"POST /graphql {(operationLabel ?? "query")}");

        using var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await client.PostAsync(_backendContext.GraphQlUrl, content).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStreamAsync().ConfigureAwait(false));
        var root = doc.RootElement.Clone();

        if (root.TryGetProperty("errors", out var errors) && errors.ValueKind == JsonValueKind.Array && errors.GetArrayLength() > 0)
        {
            var message = errors[0].TryGetProperty("message", out var m) ? m.GetString() : "GraphQL error";
            throw new InvalidOperationException($"GraphQL error: {message}");
        }

        return root.TryGetProperty("data", out var data) ? data.Clone() : default;
    }
}
