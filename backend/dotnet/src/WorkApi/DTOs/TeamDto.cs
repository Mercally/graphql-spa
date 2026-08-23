namespace WorkApi.DTOs;

public class TeamDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public string ProjectId { get; set; } = string.Empty;
    public List<string> MemberUserIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateTeamDto
{
    public required string Name { get; set; }
    public required string ProjectId { get; set; }
    public List<string> MemberUserIds { get; set; } = new();
}

public class UpdateTeamDto
{
    public string? Name { get; set; }
    public string? ProjectId { get; set; }
    public List<string>? MemberUserIds { get; set; }
}
