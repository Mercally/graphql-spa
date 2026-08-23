namespace WorkMvc.Services.GraphQl;

// Shapes mirroring the selection sets used in each query below. System.Text.Json's
// case-insensitive matching (JsonSerializerDefaults.Web) lets these map directly onto the
// GraphQL response's camelCase field names.

public class GqlUser
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class GqlTag
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Color { get; set; } = "";
}

public class GqlComment
{
    public string Id { get; set; } = "";
    public string Text { get; set; } = "";
    public string UserId { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class GqlTaskBrief
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Status { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public GqlUser? AssignedUser { get; set; }
    public List<GqlTag> Tags { get; set; } = new();
}

public class GqlTaskDetail
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public GqlUser? AssignedUser { get; set; }
    public List<GqlTag> Tags { get; set; } = new();
    public List<GqlComment> Comments { get; set; } = new();
}

public class GqlTaskPage
{
    public List<GqlTaskBrief> Items { get; set; } = new();
}

public class GqlTeamDetail
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public List<GqlUser> Users { get; set; } = new();
}

public class GqlProjectBrief
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Status { get; set; } = "";
}

public class GqlProjectDetail
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string CustomerId { get; set; } = "";
    public List<GqlTaskBrief> Tasks { get; set; } = new();
    public List<GqlTeamDetail> Teams { get; set; } = new();
}

public class GqlCustomerBrief
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class GqlCustomerDetail
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public List<GqlProjectBrief> Projects { get; set; } = new();
}
