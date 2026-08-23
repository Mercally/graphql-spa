using HotChocolate;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.GraphQL.Queries;

public class QueryResolvers
{
    public async IAsyncEnumerable<CustomerModel> GetCustomers(
        [Service] ICustomerRepository repo,
        int offset = 0,
        int limit = 20)
    {
        var items = await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<CustomerModel?> GetCustomerById(
        [Service] ICustomerRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<ProjectModel> GetProjects(
        [Service] IProjectRepository repo,
        int offset = 0,
        int limit = 20,
        string? status = null,
        string? customerId = null)
    {
        var items = customerId != null
            ? await repo.GetByCustomerIdAsync(customerId, offset, limit).ConfigureAwait(false)
            : status != null
            ? await repo.GetByStatusAsync(status, offset, limit).ConfigureAwait(false)
            : await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<ProjectModel?> GetProjectById(
        [Service] IProjectRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<TaskModel> GetTasks(
        [Service] ITaskRepository repo,
        int offset = 0,
        int limit = 20,
        string? status = null,
        string? projectId = null,
        string? assignedUserId = null)
    {
        var items = projectId != null
            ? await repo.GetByProjectIdAsync(projectId, offset, limit).ConfigureAwait(false)
            : status != null
            ? await repo.GetByStatusAsync(status, offset, limit).ConfigureAwait(false)
            : assignedUserId != null
            ? await repo.GetByAssignedUserIdAsync(assignedUserId, offset, limit).ConfigureAwait(false)
            : await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<TaskModel?> GetTaskById(
        [Service] ITaskRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<TeamModel> GetTeams(
        [Service] ITeamRepository repo,
        int offset = 0,
        int limit = 20,
        string? projectId = null)
    {
        var items = projectId != null
            ? await repo.GetByProjectIdAsync(projectId, offset, limit).ConfigureAwait(false)
            : await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<TeamModel?> GetTeamById(
        [Service] ITeamRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<UserModel> GetUsers(
        [Service] IUserRepository repo,
        int offset = 0,
        int limit = 20)
    {
        var items = await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<UserModel?> GetUserById(
        [Service] IUserRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<TagModel> GetTags(
        [Service] ITagRepository repo,
        int offset = 0,
        int limit = 20)
    {
        var items = await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }

    public async ValueTask<TagModel?> GetTagById(
        [Service] ITagRepository repo, string id)
    {
        return await repo.GetByIdAsync(id).ConfigureAwait(false);
    }

    public async IAsyncEnumerable<CommentModel> GetComments(
        [Service] ICommentRepository repo,
        int offset = 0,
        int limit = 20,
        string? taskId = null,
        string? userId = null)
    {
        var items = taskId != null
            ? await repo.GetByTaskIdAsync(taskId, offset, limit).ConfigureAwait(false)
            : userId != null
            ? await repo.GetByUserIdAsync(userId, offset, limit).ConfigureAwait(false)
            : await repo.GetAllAsync(offset, limit).ConfigureAwait(false);
        foreach (var item in items) yield return item;
    }
}
