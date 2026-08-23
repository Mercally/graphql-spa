using System.Text.Json;
using WorkMvc.Models.View;
using WorkMvc.Services.Backend;
using WorkMvc.Services.GraphQl;

namespace WorkMvc.Services.Clients.GraphQl;

/// <summary>
/// The two backends' schemas are not byte-identical here even though both are "GraphQL":
/// the top-level `tasks(...)` query returns a plain list on .NET (Hot Chocolate) but a
/// `{ items, total }` page type on Node (Mercurius), because they were built independently
/// against the same domain, exactly the way two real teams' GraphQL APIs might diverge.
/// GetListAsync below picks the matching query text per active backend; everything else
/// (task detail, assignedUser, tags) is identical across both schemas.
/// </summary>
public class GraphQlTaskClient : ITaskDataClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private const string TaskFields = @"
        id
        title
        status
        projectId
        assignedUser { id name email role }
        tags { id name color }";

    private const string ListQueryDotnet = @"
        query TaskList($status: String, $projectId: String, $offset: Int, $limit: Int) {
            tasks(status: $status, projectId: $projectId, offset: $offset, limit: $limit) {
                " + TaskFields + @"
            }
        }";

    private const string ListQueryNode = @"
        query TaskList($status: TaskStatus, $projectId: ID, $offset: Int, $limit: Int) {
            tasks(status: $status, projectId: $projectId, offset: $offset, limit: $limit) {
                items {
                    " + TaskFields + @"
                }
            }
        }";

    // Comment.user is only a navigable field on the Node schema, so the shared query below
    // deliberately keeps Comment flat (id/text/userId) and resolves author names from a
    // second root field (users) bundled into the SAME request - still 1 HTTP call total,
    // and it works unchanged against either backend's schema.
    private const string DetailQuery = @"
        query TaskDetail($id: ID!) {
            task(id: $id) {
                id
                title
                description
                status
                projectId
                assignedUser { id name email role }
                tags { id name color }
                comments { id text userId createdAt }
            }
            users(limit: 200) { id name email role }
        }";

    private readonly IGraphQlGateway _gateway;
    private readonly IBackendContext _backendContext;

    public GraphQlTaskClient(IGraphQlGateway gateway, IBackendContext backendContext)
    {
        _gateway = gateway;
        _backendContext = backendContext;
    }

    public async Task<List<TaskListItemVm>> GetListAsync(string? status, string? projectId, int offset, int limit)
    {
        var query = _backendContext.Backend == ApiBackend.Dotnet ? ListQueryDotnet : ListQueryNode;
        var data = await _gateway.ExecuteAsync(query, new { status, projectId, offset, limit }, "tasks").ConfigureAwait(false);

        var tasksProp = data.GetProperty("tasks");
        var briefs = _backendContext.Backend == ApiBackend.Dotnet
            ? tasksProp.Deserialize<List<GqlTaskBrief>>(JsonOptions) ?? new()
            : (tasksProp.Deserialize<GqlTaskPage>(JsonOptions) ?? new()).Items;

        return briefs.Select(Map).ToList();
    }

    public async Task<TaskDetailVm?> GetByIdAsync(string id)
    {
        var data = await _gateway.ExecuteAsync(DetailQuery, new { id }, "task+users").ConfigureAwait(false);
        var taskProp = data.GetProperty("task");
        if (taskProp.ValueKind == JsonValueKind.Null) return null;

        var task = taskProp.Deserialize<GqlTaskDetail>(JsonOptions)!;
        var users = data.GetProperty("users").Deserialize<List<GqlUser>>(JsonOptions) ?? new();
        var usersById = users.ToDictionary(u => u.Id);

        return new TaskDetailVm
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            ProjectId = task.ProjectId,
            AssignedUser = task.AssignedUser == null ? null : MapUser(task.AssignedUser),
            Tags = task.Tags.Select(t => new TagVm { Id = t.Id, Name = t.Name, Color = t.Color }).ToList(),
            Comments = task.Comments.Select(c => new CommentVm
            {
                Id = c.Id,
                Text = c.Text,
                CreatedAt = c.CreatedAt,
                User = usersById.TryGetValue(c.UserId, out var u) ? MapUser(u) : null
            }).ToList()
        };
    }

    private static TaskListItemVm Map(GqlTaskBrief t) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Status = t.Status,
        ProjectId = t.ProjectId,
        AssignedUser = t.AssignedUser == null ? null : MapUser(t.AssignedUser),
        Tags = t.Tags.Select(tag => new TagVm { Id = tag.Id, Name = tag.Name, Color = tag.Color }).ToList()
    };

    private static UserVm MapUser(GqlUser u) => new() { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role };
}
