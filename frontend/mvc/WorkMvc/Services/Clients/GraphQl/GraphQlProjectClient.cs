using System.Text.Json;
using WorkMvc.Models.View;
using WorkMvc.Services.GraphQl;

namespace WorkMvc.Services.Clients.GraphQl;

/// <summary>
/// GraphQL implementation of the Requirements.md section 4 headline demo: project, its
/// tasks (with assignedUser + tags), and its teams (with users) all come back from ONE
/// POST /graphql request - versus the REST client's 5 separate calls for the same data.
/// </summary>
public class GraphQlProjectClient : IProjectDataClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // id inlined as a literal (see GraphQlCustomerClient for why: the two backends declare
    // this argument as String! vs ID!, which only literals - not typed $variables - satisfy
    // uniformly).
    private static string DetailQuery(string id) => $@"
        query {{
            project(id: {Literal(id)}) {{
                id
                name
                description
                status
                customerId
                tasks {{
                    id
                    title
                    status
                    projectId
                    assignedUser {{ id name email role }}
                    tags {{ id name color }}
                }}
                teams {{
                    id
                    name
                    projectId
                    users {{ id name email role }}
                }}
            }}
        }}";

    private readonly IGraphQlGateway _gateway;

    public GraphQlProjectClient(IGraphQlGateway gateway) => _gateway = gateway;

    private static string Literal(string s) => System.Text.Json.JsonSerializer.Serialize(s);

    public async Task<ProjectDetailVm?> GetByIdAsync(string id)
    {
        var data = await _gateway.ExecuteAsync(DetailQuery(id), operationLabel: "project+tasks+teams").ConfigureAwait(false);
        var projectProp = data.GetProperty("project");
        if (projectProp.ValueKind == JsonValueKind.Null) return null;

        var project = projectProp.Deserialize<GqlProjectDetail>(JsonOptions)!;

        return new ProjectDetailVm
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            CustomerId = project.CustomerId,
            Tasks = project.Tasks.Select(t => new TaskListItemVm
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                ProjectId = t.ProjectId,
                AssignedUser = t.AssignedUser == null ? null : Map(t.AssignedUser),
                Tags = t.Tags.Select(tag => new TagVm { Id = tag.Id, Name = tag.Name, Color = tag.Color }).ToList()
            }).ToList(),
            Teams = project.Teams.Select(team => new TeamDetailVm
            {
                Id = team.Id,
                Name = team.Name,
                ProjectId = team.ProjectId,
                Users = team.Users.Select(Map).ToList()
            }).ToList()
        };
    }

    private static UserVm Map(GqlUser u) => new() { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role };
}
