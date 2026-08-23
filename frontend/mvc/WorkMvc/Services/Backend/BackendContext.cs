namespace WorkMvc.Services.Backend;

public enum ApiMode { Rest, GraphQl }
public enum ApiBackend { Dotnet, Node }

/// <summary>
/// Per-request "which backend / which paradigm" switch.
///
/// How switching works (Requirements.md section 12 point 3): every request can carry
/// ?mode=rest|graphql and ?backend=dotnet|node in the query string. Because links in the
/// views use the asp-route-mode/asp-route-backend tag helpers (see _Layout.cshtml and the
/// mode-switch partial), the current selection is propagated automatically as you click
/// around the site without needing to retype it. As a convenience, whatever is read from
/// the query string on a request is also written to a cookie so a bookmarked/plain URL
/// (no query string) keeps using your last choice; the very first visit defaults to
/// REST + .NET.
/// </summary>
public interface IBackendContext
{
    ApiMode Mode { get; }
    ApiBackend Backend { get; }
    string ApiBaseUrl { get; }
    string GraphQlUrl { get; }
}

public class BackendContext : IBackendContext
{
    private const string ModeCookie = "wm_mode";
    private const string BackendCookie = "wm_backend";

    public ApiMode Mode { get; }
    public ApiBackend Backend { get; }
    public string ApiBaseUrl { get; }
    public string GraphQlUrl { get; }

    public BackendContext(IHttpContextAccessor accessor, BackendOptions options)
    {
        var http = accessor.HttpContext;

        Mode = Resolve(http, "mode", ModeCookie, "rest") == "graphql" ? ApiMode.GraphQl : ApiMode.Rest;
        Backend = Resolve(http, "backend", BackendCookie, "dotnet") == "node" ? ApiBackend.Node : ApiBackend.Dotnet;

        ApiBaseUrl = Backend == ApiBackend.Dotnet ? options.DotnetApiUrl : options.NodeApiUrl;
        GraphQlUrl = Backend == ApiBackend.Dotnet ? options.DotnetGraphQlUrl : options.NodeGraphQlUrl;
    }

    private static string Resolve(HttpContext? http, string queryKey, string cookieName, string @default)
    {
        if (http == null) return @default;

        if (http.Request.Query.TryGetValue(queryKey, out var fromQuery) && !string.IsNullOrWhiteSpace(fromQuery))
        {
            var value = fromQuery.ToString().ToLowerInvariant();
            http.Response.Cookies.Append(cookieName, value, new CookieOptions { IsEssential = true, MaxAge = TimeSpan.FromDays(30) });
            return value;
        }

        if (http.Request.Cookies.TryGetValue(cookieName, out var fromCookie) && !string.IsNullOrWhiteSpace(fromCookie))
        {
            return fromCookie.ToLowerInvariant();
        }

        return @default;
    }
}
