namespace WorkApi.DTOs;

public class CommentDto
{
    public required string Id { get; set; }
    public required string Text { get; set; }
    public string TaskId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateCommentDto
{
    public required string Text { get; set; }
    public required string TaskId { get; set; }
    public required string UserId { get; set; }
}

public class UpdateCommentDto
{
    public string? Text { get; set; }
    public string? TaskId { get; set; }
    public string? UserId { get; set; }
}
