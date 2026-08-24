using HotChocolate;
using WorkApi.Models;
using WorkApi.Repositories;
using WorkApi.Services.Notifications;

namespace WorkApi.GraphQL.Mutations;

public class MutationResolvers
{
    public async ValueTask<CustomerModel> CreateCustomer(
        [Service] ICustomerRepository repo, string name, string email)
    {
        var entity = new CustomerModel { Name = name, Email = email };
        return await repo.InsertAsync(entity).ConfigureAwait(false);
    }

    public async ValueTask<CustomerModel?> UpdateCustomer(
        [Service] ICustomerRepository repo, string id, string name, string email)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Name = name;
        existing.Email = email;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteCustomer(
        [Service] ICustomerRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<ProjectModel> CreateProject(
        [Service] IProjectRepository repo, string name, string? description, string customerId, string? status)
    {
        var entity = new ProjectModel
        {
            Name = name,
            Description = description ?? string.Empty,
            CustomerId = customerId,
            Status = status ?? "active"
        };
        return await repo.InsertAsync(entity).ConfigureAwait(false);
    }

    public async ValueTask<ProjectModel?> UpdateProject(
        [Service] IProjectRepository repo, string id, string name, string? description, string? status)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Name = name;
        existing.Description = description ?? existing.Description;
        existing.Status = status ?? existing.Status;
        existing.UpdatedAt = DateTime.UtcNow;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteProject(
        [Service] IProjectRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<TeamModel> CreateTeam(
        [Service] ITeamRepository repo, string name, string projectId, List<string?>? memberUserIds)
    {
        var entity = new TeamModel
        {
            Name = name,
            ProjectId = projectId,
            MemberUserIds = memberUserIds ?? new List<string?>()
        };
        return await repo.InsertAsync(entity).ConfigureAwait(false);
    }

    public async ValueTask<TeamModel?> UpdateTeam(
        [Service] ITeamRepository repo, string id, string name, List<string?>? memberUserIds)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Name = name;
        if (memberUserIds != null) existing.MemberUserIds = memberUserIds;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteTeam(
        [Service] ITeamRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<UserModel> CreateUser(
        [Service] IUserRepository repo, [Service] INotificationTrigger notifications,
        string name, string email, string role)
    {
        var entity = new UserModel { Name = name, Email = email, Role = role };
        var created = await repo.InsertAsync(entity).ConfigureAwait(false);
        await notifications.UserWelcomeAsync(created).ConfigureAwait(false);
        return created;
    }

    public async ValueTask<UserModel?> UpdateUser(
        [Service] IUserRepository repo, string id, string name, string email, string role)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Name = name;
        existing.Email = email;
        existing.Role = role;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteUser(
        [Service] IUserRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<TaskModel> CreateTask(
        [Service] ITaskRepository repo, [Service] INotificationTrigger notifications,
        string title, string? description, string projectId, string? status, string? assignedUserId, List<string?>? tagIds)
    {
        var entity = new TaskModel
        {
            Title = title,
            Description = description ?? string.Empty,
            ProjectId = projectId,
            Status = status ?? "pending",
            AssignedUserId = assignedUserId,
            TagIds = tagIds ?? new List<string?>()
        };
        var created = await repo.InsertAsync(entity).ConfigureAwait(false);
        await notifications.TaskAssignedAsync(created).ConfigureAwait(false);
        return created;
    }

    public async ValueTask<TaskModel?> UpdateTask(
        [Service] ITaskRepository repo, [Service] INotificationTrigger notifications,
        string id, string title, string? description, string? status, string? assignedUserId, List<string?>? tagIds)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        var previousAssignedUserId = existing.AssignedUserId;
        existing.Title = title;
        existing.Description = description ?? existing.Description;
        existing.Status = status ?? existing.Status;
        existing.AssignedUserId = assignedUserId ?? existing.AssignedUserId;
        if (tagIds != null) existing.TagIds = tagIds;
        existing.UpdatedAt = DateTime.UtcNow;
        var updated = await repo.UpdateAsync(id, existing).ConfigureAwait(false);
        if (updated != null && !string.IsNullOrEmpty(updated.AssignedUserId) && updated.AssignedUserId != previousAssignedUserId)
        {
            await notifications.TaskAssignedAsync(updated).ConfigureAwait(false);
        }
        return updated;
    }

    public async ValueTask<bool> DeleteTask(
        [Service] ITaskRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<TagModel> CreateTag(
        [Service] ITagRepository repo, string name, string? color)
    {
        var entity = new TagModel { Name = name, Color = color ?? string.Empty };
        return await repo.InsertAsync(entity).ConfigureAwait(false);
    }

    public async ValueTask<TagModel?> UpdateTag(
        [Service] ITagRepository repo, string id, string name, string? color)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Name = name;
        if (color != null) existing.Color = color;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteTag(
        [Service] ITagRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }

    public async ValueTask<CommentModel> CreateComment(
        [Service] ICommentRepository repo, string text, string taskId, string userId)
    {
        var entity = new CommentModel { Text = text, TaskId = taskId, UserId = userId };
        return await repo.InsertAsync(entity).ConfigureAwait(false);
    }

    public async ValueTask<CommentModel?> UpdateComment(
        [Service] ICommentRepository repo, string id, string text)
    {
        var existing = await repo.GetByIdAsync(id).ConfigureAwait(false);
        if (existing == null) return null;
        existing.Text = text;
        return await repo.UpdateAsync(id, existing).ConfigureAwait(false);
    }

    public async ValueTask<bool> DeleteComment(
        [Service] ICommentRepository repo, string id)
    {
        return await repo.DeleteAsync(id).ConfigureAwait(false);
    }
}
