using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;
using WorkMvc.Services.Clients.GraphQl;
using WorkMvc.Services.Clients.Rest;
using WorkMvc.Services.GraphQl;
using WorkMvc.Services.Rest;

var builder = WebApplication.CreateBuilder(args);

// Configuration: environment variables win, then appsettings.json, then a usable localhost
// default - same precedence pattern used by both backends (see backend/dotnet Program.cs).
// Per Requirements.md section 25 / the root .env.example, the four variable names are:
//   DOTNET_API_URL, DOTNET_GRAPHQL_URL, NODE_API_URL, NODE_GRAPHQL_URL
string ResolveUrl(string envVar, string configKey, string fallback) =>
    Environment.GetEnvironmentVariable(envVar)
    ?? builder.Configuration[configKey]
    ?? fallback;

var backendOptions = new BackendOptions
{
    DotnetApiUrl = ResolveUrl("DOTNET_API_URL", "BackendUrls:DotnetApiUrl", "http://localhost:5000"),
    DotnetGraphQlUrl = ResolveUrl("DOTNET_GRAPHQL_URL", "BackendUrls:DotnetGraphQlUrl", "http://localhost:5000/graphql"),
    NodeApiUrl = ResolveUrl("NODE_API_URL", "BackendUrls:NodeApiUrl", "http://localhost:4000"),
    NodeGraphQlUrl = ResolveUrl("NODE_GRAPHQL_URL", "BackendUrls:NodeGraphQlUrl", "http://localhost:4000/graphql")
};
builder.Services.AddSingleton(backendOptions);

builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

// Named HttpClients for the two consumption modes (Requirements.md section 12 point 6).
// Base addresses are not fixed here because the target backend (.NET vs Node) is chosen
// per-request; RestGateway/GraphQlGateway build the full absolute URL from IBackendContext.
builder.Services.AddHttpClient("Rest");
builder.Services.AddHttpClient("GraphQl");

// Per-request mode/backend switch + HTTP call counter, both scoped so they reset every request.
builder.Services.AddScoped<IBackendContext, BackendContext>();
builder.Services.AddScoped<IRequestCounter, RequestCounter>();

builder.Services.AddScoped<IRestGateway, RestGateway>();
builder.Services.AddScoped<IGraphQlGateway, GraphQlGateway>();

// Two implementations per entity client, registered under keyed DI ("rest" / "graphql").
// DataClientFactory picks the right key per request based on IBackendContext.Mode.
builder.Services.AddKeyedScoped<ICustomerDataClient, RestCustomerClient>("rest");
builder.Services.AddKeyedScoped<ICustomerDataClient, GraphQlCustomerClient>("graphql");

builder.Services.AddKeyedScoped<IProjectDataClient, RestProjectClient>("rest");
builder.Services.AddKeyedScoped<IProjectDataClient, GraphQlProjectClient>("graphql");

builder.Services.AddKeyedScoped<ITaskDataClient, RestTaskClient>("rest");
builder.Services.AddKeyedScoped<ITaskDataClient, GraphQlTaskClient>("graphql");

builder.Services.AddKeyedScoped<ITeamDataClient, RestTeamClient>("rest");
builder.Services.AddKeyedScoped<ITeamDataClient, GraphQlTeamClient>("graphql");

builder.Services.AddKeyedScoped<IUserDataClient, RestUserClient>("rest");
builder.Services.AddKeyedScoped<IUserDataClient, GraphQlUserClient>("graphql");

builder.Services.AddScoped<IDataClientFactory, DataClientFactory>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Customer}/{action=Index}/{id?}");

app.Run();
