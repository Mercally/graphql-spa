using WorkMvc.Models.View;
using WorkMvc.Services.Rest;

namespace WorkMvc.Services.Clients.Rest;

/// <summary>
/// REST implementation of the project detail "headline demo" from Requirements.md section 4:
/// Project -> Tasks -> AssignedUser/Tags, Project -> Teams -> Users. To show the same
/// information the GraphQL version gets in one query, REST needs 5 separate calls:
///   1. GET /api/projects/{id}
///   2. GET /api/tasks?projectId={id}
///   3. GET /api/teams?projectId={id}
///   4. GET /api/users            (fetched in full, then matched in memory - classic
///                                  REST over-fetching: we only need a handful of users
///                                  but there is no "users by id list" endpoint)
///   5. GET /api/tags             (same over-fetching story for tags)
/// </summary>
public class RestProjectClient : IProjectDataClient
{
    private readonly IRestGateway _gateway;

    public RestProjectClient(IRestGateway gateway) => _gateway = gateway;

    public async Task<ProjectDetailVm?> GetByIdAsync(string id)
    {
        var project = await _gateway.GetSingleAsync<ProjectRestDto>($"/api/projects/{id}").ConfigureAwait(false);
        if (project == null) return null;

        var tasksTask = _gateway.GetListAsync<TaskRestDto>(
            "/api/tasks", 0, 100, new Dictionary<string, string?> { ["projectId"] = id });
        var teamsTask = _gateway.GetListAsync<TeamRestDto>(
            "/api/teams", 0, 50, new Dictionary<string, string?> { ["projectId"] = id });
        var usersTask = _gateway.GetListAsync<UserRestDto>("/api/users", 0, 200);
        var tagsTask = _gateway.GetListAsync<TagRestDto>("/api/tags", 0, 200);

        var tasks = await tasksTask.ConfigureAwait(false);
        var teams = await teamsTask.ConfigureAwait(false);
        var users = await usersTask.ConfigureAwait(false);
        var tags = await tagsTask.ConfigureAwait(false);

        var usersById = users.ToDictionary(u => u.Id);
        var tagsById = tags.ToDictionary(t => t.Id);

        var taskVms = tasks.Select(t => new TaskListItemVm
        {
            Id = t.Id,
            Title = t.Title,
            Status = t.Status,
            ProjectId = t.ProjectId,
            AssignedUser = t.AssignedUserId != null && usersById.TryGetValue(t.AssignedUserId, out var u)
                ? new UserVm { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role }
                : null,
            Tags = t.TagIds.Where(tagsById.ContainsKey)
                .Select(tid => tagsById[tid])
                .Select(tag => new TagVm { Id = tag.Id, Name = tag.Name, Color = tag.Color })
                .ToList()
        }).ToList();

        var teamVms = teams.Select(team => new TeamDetailVm
        {
            Id = team.Id,
            Name = team.Name,
            ProjectId = team.ProjectId,
            Users = team.MemberUserIds.Where(usersById.ContainsKey)
                .Select(uid => usersById[uid])
                .Select(u => new UserVm { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role })
                .ToList()
        }).ToList();

        return new ProjectDetailVm
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            CustomerId = project.CustomerId,
            Tasks = taskVms,
            Teams = teamVms
        };
    }
}
