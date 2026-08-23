using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using WorkApi;
using WorkApi.Repositories;
using WorkApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration: environment variables take priority over appsettings.json, which in turn
// falls back to a real, usable localhost default. ASP.NET config does not expand "{VAR}"
// placeholder syntax on its own, so appsettings.json must hold an actual default value.
var mongoConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING")
    ?? builder.Configuration["MongoDB:ConnectionString"]
    ?? "mongodb://localhost:27017";
var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE")
    ?? builder.Configuration["MongoDB:DatabaseName"]
    ?? "workmanagement";

// Services
builder.Services.AddSingleton<IMongoClient>(sp =>
    new MongoClient(mongoConnectionString));
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoClient>().GetDatabase(databaseName));

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();

builder.Services.AddScoped<IMapperHelper, MapperHelper>();
builder.Services.AddScoped<IWorkDomainService, WorkDomainService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WorkApi", Version = "v1" });
});

// Hot Chocolate 13.x: query/mutation root types live in the Queries/Mutations namespaces.
// Field resolvers get their dependencies through standard DI, either via [Service] parameters
// on resolver methods (see QueryResolvers/MutationResolvers) or via context.Service<T>() inside
// a field's .Resolve(...) delegate (see the relation fields on CustomerType/ProjectType/etc.) -
// there is no such thing as "AddInjectableResolvers()"; DI is wired the normal way.
builder.Services.AddGraphQLServer()
    .AddQueryType<WorkApi.GraphQL.Queries.QueryType>()
    .AddMutationType<WorkApi.GraphQL.Mutations.MutationType>()
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = builder.Environment.IsDevelopment());
// The GraphQL IDE (Nitro / Banana Cake Pop) ships with HotChocolate.AspNetCore and is served
// automatically at the /graphql endpoint mapped below when the app is running in Development.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();
app.MapGraphQL();

app.Run();

// Exposes the top-level Program for WebApplicationFactory<Program> in integration tests.
public partial class Program { }
