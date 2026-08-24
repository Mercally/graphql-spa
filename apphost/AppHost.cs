var builder = DistributedApplication.CreateBuilder(args);

// MongoDB — same port (27017) and same database name ("workmanagement") the
// rest of the repo already assumes (docker-compose.yml, .env.example,
// scripts/seed). Persistent lifetime so `aspire run` restarts don't wipe
// seeded data, and a named volume so it survives across runs the same way
// the docker-compose setup does.
//
// Fixed, non-secret dev credentials (not the Aspire default of a random
// generated password) so `npm run seed` can be pointed at it with a plain,
// documented connection string — matches this PoC's "no real security"
// stance (Requirements.md section 23) instead of forcing secret-store
// lookups for local development.
var mongoUser = builder.AddParameter("mongo-username", "admin");
var mongoPassword = builder.AddParameter("mongo-password", "devpassword");

var mongo = builder.AddMongoDB("mongo", userName: mongoUser, password: mongoPassword, port: 27017)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume("poc-mongodb-data");

var mongoDb = mongo.AddDatabase("workmanagement");

// Notification microservice (Requirements.md section 35) - simulated email sender, talks gRPC
// only, no REST/GraphQL, no Mongo. dotnet-api is its only caller for now.
var notifications = builder.AddProject<Projects.NotificationService>("notifications")
    .WithHttpEndpoint(port: 5100, env: "ASPNETCORE_HTTP_PORTS")
    .WithExternalHttpEndpoints();

// .NET backend (REST + GraphQL on one Kestrel host).
var dotnetApi = builder.AddProject<Projects.WorkApi>("dotnet-api")
    .WithHttpEndpoint(port: 5000, env: "ASPNETCORE_HTTP_PORTS")
    .WithEnvironment("MONGODB_CONNECTION_STRING", mongoDb)
    .WithEnvironment("MONGODB_DATABASE", "workmanagement")
    .WithEnvironment("NOTIFICATION_GRPC_URL", notifications.GetEndpoint("http"))
    .WaitFor(mongoDb)
    .WaitFor(notifications)
    .WithExternalHttpEndpoints();

// Node.js backend (REST + GraphQL on one Fastify host) — same schema/data.
var nodeApi = builder.AddNpmApp("node-api", "../backend/node", "dev")
    .WithHttpEndpoint(port: 4000, env: "PORT")
    .WithEnvironment("MONGODB_CONNECTION_STRING", mongoDb)
    .WithEnvironment("MONGODB_DATABASE", "workmanagement")
    .WaitFor(mongoDb)
    .WithExternalHttpEndpoints();

// Angular — REST + GraphQL clients, backend picked at runtime via its own
// header toggle, so it only needs both backends to be reachable, not a
// single injected base URL.
var angular = builder.AddNpmApp("angular", "../frontend/angular", "start")
    .WithHttpEndpoint(port: 4200, targetPort: 4201, env: "PORT")
    .WithArgs("--", "angular", "--port", "4201")
    .WaitFor(dotnetApi)
    .WaitFor(nodeApi)
    .WithExternalHttpEndpoints();

// React — same idea, its own runtime backend/mode toggle.
var react = builder.AddNpmApp("react", "../frontend/react", "dev")
    .WithHttpEndpoint(port: 5173, targetPort: 5174, env: "PORT")
    .WithArgs("--", "--port", "5174")
    .WaitFor(dotnetApi)
    .WaitFor(nodeApi)
    .WithExternalHttpEndpoints();

// ASP.NET MVC — remote HTTP client of both backends; base URLs match
// .env.example / appsettings.json's BackendUrls fallback, kept in sync here
// so switching ?backend=dotnet|node&mode=rest|graphql always resolves.
builder.AddProject<Projects.WorkMvc>("mvc")
    .WithHttpEndpoint(port: 5065, env: "ASPNETCORE_HTTP_PORTS")
    .WithEnvironment("DOTNET_API_URL", dotnetApi.GetEndpoint("http"))
    .WithEnvironment("DOTNET_GRAPHQL_URL", ReferenceExpression.Create($"{dotnetApi.GetEndpoint("http")}/graphql"))
    .WithEnvironment("NODE_API_URL", nodeApi.GetEndpoint("http"))
    .WithEnvironment("NODE_GRAPHQL_URL", ReferenceExpression.Create($"{nodeApi.GetEndpoint("http")}/graphql"))
    .WaitFor(dotnetApi)
    .WaitFor(nodeApi)
    .WithExternalHttpEndpoints();

builder.Build().Run();
