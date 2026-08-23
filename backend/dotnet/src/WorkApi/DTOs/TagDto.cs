namespace WorkApi.DTOs;

public class TagDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Color { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTagDto
{
    public required string Name { get; set; }
    public required string Color { get; set; }
}

public class UpdateTagDto
{
    public string? Name { get; set; }
    public string? Color { get; set; }
}
