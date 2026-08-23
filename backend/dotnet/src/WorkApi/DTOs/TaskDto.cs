namespace WorkApi.DTOs;

public class TaskDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string ProjectId { get; set; } = string.Empty;
    public required string Status { get; set; }
    public string? AssignedUserId { get; set; }
    public List<string> TagIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTaskDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string ProjectId { get; set; }
    public required string Status { get; set; }
    public string? AssignedUserId { get; set; }
    public List<string> TagIds { get; set; } = new();
}

public class UpdateTaskDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ProjectId { get; set; }
    public string? Status { get; set; }
    public string? AssignedUserId { get; set; }
    public List<string>? TagIds { get; set; }
}
