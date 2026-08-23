using WorkApi.DTOs;
using WorkApi.Models;

namespace WorkApi;

public interface IMapperHelper
{
    CustomerDto MapCustomerToDto(CustomerModel model);
    ProjectDto MapProjectToDto(ProjectModel model);
    TeamDto MapTeamToDto(TeamModel model);
    UserDto MapUserToDto(UserModel model);
    TaskDto MapTaskToDto(TaskModel model);
    TagDto MapTagToDto(TagModel model);
    CommentDto MapCommentToDto(CommentModel model);
}

public class MapperHelper : IMapperHelper
{
    public CustomerDto MapCustomerToDto(CustomerModel model) =>
        new() { Id = model.Id!, Name = model.Name, Email = model.Email, CreatedAt = model.CreatedAt };

    public ProjectDto MapProjectToDto(ProjectModel model) =>
        new()
        {
            Id = model.Id!,
            Name = model.Name,
            Description = model.Description,
            CustomerId = model.CustomerId ?? string.Empty,
            Status = model.Status,
            CreatedAt = model.CreatedAt,
            UpdatedAt = model.UpdatedAt
        };

    public TeamDto MapTeamToDto(TeamModel model) =>
        new()
        {
            Id = model.Id!,
            Name = model.Name,
            ProjectId = model.ProjectId ?? string.Empty,
            MemberUserIds = model.MemberUserIds.Where(x => x != null).Cast<string>().ToList(),
            CreatedAt = model.CreatedAt
        };

    public UserDto MapUserToDto(UserModel model) =>
        new() { Id = model.Id!, Name = model.Name, Email = model.Email, Role = model.Role, CreatedAt = model.CreatedAt };

    public TaskDto MapTaskToDto(TaskModel model) =>
        new()
        {
            Id = model.Id!,
            Title = model.Title,
            Description = model.Description,
            ProjectId = model.ProjectId ?? string.Empty,
            Status = model.Status,
            AssignedUserId = model.AssignedUserId,
            TagIds = model.TagIds?.Where(x => x != null).Cast<string>().ToList() ?? new List<string>(),
            CreatedAt = model.CreatedAt,
            UpdatedAt = model.UpdatedAt
        };

    public TagDto MapTagToDto(TagModel model) =>
        new() { Id = model.Id!, Name = model.Name, Color = model.Color, CreatedAt = model.CreatedAt };

    public CommentDto MapCommentToDto(CommentModel model) =>
        new() { Id = model.Id!, Text = model.Text, TaskId = model.TaskId ?? string.Empty, UserId = model.UserId ?? string.Empty, CreatedAt = model.CreatedAt };
}
