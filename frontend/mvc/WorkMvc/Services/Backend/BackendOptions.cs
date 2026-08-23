namespace WorkMvc.Services.Backend;

/// <summary>
/// Base URLs for the two backends this MVC app can talk to, resolved once at
/// startup in Program.cs from environment variables (DOTNET_API_URL,
/// DOTNET_GRAPHQL_URL, NODE_API_URL, NODE_GRAPHQL_URL) with appsettings.json
/// as a fallback, per Requirements.md section 25 ("todas las URLs deben ser
/// configurables"). MVC never talks to MongoDB directly - only these HTTP
/// endpoints.
/// </summary>
public class BackendOptions
{
    public required string DotnetApiUrl { get; init; }
    public required string DotnetGraphQlUrl { get; init; }
    public required string NodeApiUrl { get; init; }
    public required string NodeGraphQlUrl { get; init; }
}
