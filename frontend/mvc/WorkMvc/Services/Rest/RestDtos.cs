namespace WorkMvc.Services.Rest;

// Raw shapes returned by GET /api/... on either backend. Field names are identical between
// the .NET and Node REST APIs (both use camelCase JSON) even though their list-wrapper and
// pagination-param conventions differ - see RestGateway for how that difference is absorbed.

public class CustomerRestDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class ProjectRestDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string CustomerId { get; set; } = "";
    public string Status { get; set; } = "";
}

public class TeamRestDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public List<string> MemberUserIds { get; set; } = new();
}

public class UserRestDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class TaskRestDto
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public string Status { get; set; } = "";
    public string? AssignedUserId { get; set; }
    public List<string> TagIds { get; set; } = new();
}

public class TagRestDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Color { get; set; } = "";
}

public class CommentRestDto
{
    public string Id { get; set; } = "";
    public string Text { get; set; } = "";
    public string TaskId { get; set; } = "";
    public string UserId { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
