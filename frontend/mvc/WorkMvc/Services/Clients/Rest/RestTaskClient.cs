using WorkMvc.Models.View;
using WorkMvc.Services.Rest;

namespace WorkMvc.Services.Clients.Rest;

public class RestTaskClient : ITaskDataClient
{
    private readonly IRestGateway _gateway;

    public RestTaskClient(IRestGateway gateway) => _gateway = gateway;

    // 3 REST calls: the filtered/paginated task page, plus a full users and a full tags
    // fetch to resolve assignedUser/tags names in memory (no "get many users by id" REST
    // endpoint exists, so the whole collection is over-fetched just to look up a few names).
    public async Task<List<TaskListItemVm>> GetListAsync(string? status, string? projectId, int offset, int limit)
    {
        var filters = new Dictionary<string, string?> { ["status"] = status, ["projectId"] = projectId };

        var tasksTask = _gateway.GetListAsync<TaskRestDto>("/api/tasks", offset, limit, filters);
        var usersTask = _gateway.GetListAsync<UserRestDto>("/api/users", 0, 200);
        var tagsTask = _gateway.GetListAsync<TagRestDto>("/api/tags", 0, 200);

        var tasks = await tasksTask.ConfigureAwait(false);
        var users = await usersTask.ConfigureAwait(false);
        var tags = await tagsTask.ConfigureAwait(false);

        var usersById = users.ToDictionary(u => u.Id);
        var tagsById = tags.ToDictionary(t => t.Id);

        return tasks.Select(t => MapTask(t, usersById, tagsById)).ToList();
    }

    // 4 REST calls: the task itself, a full users fetch (assignedUser + comment authors), a
    // full tags fetch, and the task's comments.
    public async Task<TaskDetailVm?> GetByIdAsync(string id)
    {
        var task = await _gateway.GetSingleAsync<TaskRestDto>($"/api/tasks/{id}").ConfigureAwait(false);
        if (task == null) return null;

        var usersTask = _gateway.GetListAsync<UserRestDto>("/api/users", 0, 200);
        var tagsTask = _gateway.GetListAsync<TagRestDto>("/api/tags", 0, 200);
        var commentsTask = _gateway.GetListAsync<CommentRestDto>(
            "/api/comments", 0, 200, new Dictionary<string, string?> { ["taskId"] = id });

        var users = await usersTask.ConfigureAwait(false);
        var tags = await tagsTask.ConfigureAwait(false);
        var comments = await commentsTask.ConfigureAwait(false);

        var usersById = users.ToDictionary(u => u.Id);
        var tagsById = tags.ToDictionary(t => t.Id);
        var brief = MapTask(task, usersById, tagsById);

        return new TaskDetailVm
        {
            Id = brief.Id,
            Title = brief.Title,
            Description = task.Description,
            Status = brief.Status,
            ProjectId = brief.ProjectId,
            AssignedUser = brief.AssignedUser,
            Tags = brief.Tags,
            Comments = comments.Select(c => new CommentVm
            {
                Id = c.Id,
                Text = c.Text,
                CreatedAt = c.CreatedAt,
                User = usersById.TryGetValue(c.UserId, out var u)
                    ? new UserVm { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role }
                    : null
            }).ToList()
        };
    }

    private static TaskListItemVm MapTask(TaskRestDto t, Dictionary<string, UserRestDto> usersById, Dictionary<string, TagRestDto> tagsById) => new()
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
    };
}
