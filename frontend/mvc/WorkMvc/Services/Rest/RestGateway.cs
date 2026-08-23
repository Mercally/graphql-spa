using System.Text.Json;
using WorkMvc.Services.Backend;

namespace WorkMvc.Services.Rest;

/// <summary>
/// Thin wrapper around HttpClient for calling /api/... on whichever backend is active.
///
/// The two backends do not wrap list responses identically even though both are "REST":
///   - .NET  uses page/pageSize query params and returns { items, totalCount, page, pageSize }
///   - Node  uses limit/offset query params and returns either a bare JSON array, or (only
///           for /api/tasks) { items, total }
/// Rather than duplicate that knowledge in every entity client, GetListAsync accepts an
/// offset/limit pair, converts it to whichever query params the active backend expects, and
/// GetItemsArray() below unwraps whichever shape comes back (object with "items", or a bare
/// array) so callers always just get a List&lt;T&gt;.
/// </summary>
public interface IRestGateway
{
    Task<T?> GetSingleAsync<T>(string path);
    Task<List<T>> GetListAsync<T>(string basePath, int offset, int limit, IDictionary<string, string?>? extraFilters = null);
}

public class RestGateway : IRestGateway
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IBackendContext _backendContext;
    private readonly IRequestCounter _counter;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public RestGateway(IHttpClientFactory httpClientFactory, IBackendContext backendContext, IRequestCounter counter)
    {
        _httpClientFactory = httpClientFactory;
        _backendContext = backendContext;
        _counter = counter;
    }

    public async Task<T?> GetSingleAsync<T>(string path)
    {
        var url = $"{_backendContext.ApiBaseUrl}{path}";
        var client = _httpClientFactory.CreateClient("Rest");
        _counter.Record($"GET {path}");

        var response = await client.GetAsync(url).ConfigureAwait(false);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound) return default;
        response.EnsureSuccessStatusCode();

        var stream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);
        return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions).ConfigureAwait(false);
    }

    public async Task<List<T>> GetListAsync<T>(string basePath, int offset, int limit, IDictionary<string, string?>? extraFilters = null)
    {
        var query = new List<string>();

        if (_backendContext.Backend == ApiBackend.Dotnet)
        {
            var page = (offset / Math.Max(limit, 1)) + 1;
            query.Add($"page={page}");
            query.Add($"pageSize={limit}");
        }
        else
        {
            query.Add($"offset={offset}");
            query.Add($"limit={limit}");
        }

        if (extraFilters != null)
        {
            foreach (var (key, value) in extraFilters)
            {
                if (!string.IsNullOrEmpty(value))
                    query.Add($"{key}={Uri.EscapeDataString(value)}");
            }
        }

        var path = $"{basePath}?{string.Join("&", query)}";
        var url = $"{_backendContext.ApiBaseUrl}{path}";
        var client = _httpClientFactory.CreateClient("Rest");
        _counter.Record($"GET {path}");

        var response = await client.GetAsync(url).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStreamAsync().ConfigureAwait(false));
        return ExtractItems<T>(doc.RootElement);
    }

    private static List<T> ExtractItems<T>(JsonElement root)
    {
        var arrayElement = root.ValueKind == JsonValueKind.Array
            ? root
            : root.TryGetProperty("items", out var items) ? items : default;

        if (arrayElement.ValueKind != JsonValueKind.Array) return new List<T>();

        var result = new List<T>();
        foreach (var element in arrayElement.EnumerateArray())
        {
            var item = element.Deserialize<T>(JsonOptions);
            if (item != null) result.Add(item);
        }
        return result;
    }
}
