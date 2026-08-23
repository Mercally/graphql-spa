namespace WorkApi.DTOs;

public class ProjectDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public required string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateProjectDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string CustomerId { get; set; }
    public required string Status { get; set; }
}

public class UpdateProjectDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CustomerId { get; set; }
    public string? Status { get; set; }
}
