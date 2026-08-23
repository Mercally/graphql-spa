namespace WorkMvc.Models.View;

public class UserVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class TagVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Color { get; set; } = "";
}

public class CommentVm
{
    public string Id { get; set; } = "";
    public string Text { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public UserVm? User { get; set; }
}

public class TaskListItemVm
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Status { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public UserVm? AssignedUser { get; set; }
    public List<TagVm> Tags { get; set; } = new();
}

public class TaskDetailVm
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public UserVm? AssignedUser { get; set; }
    public List<TagVm> Tags { get; set; } = new();
    public List<CommentVm> Comments { get; set; } = new();
}

public class TeamListItemVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public int MemberCount { get; set; }
}

public class TeamDetailVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public List<UserVm> Users { get; set; } = new();
}

public class ProjectListItemVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Status { get; set; } = "";
}

public class ProjectDetailVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string CustomerId { get; set; } = "";
    public List<TaskListItemVm> Tasks { get; set; } = new();

    // Full nested Teams -> Users, per Requirements.md's explicit
    // "Project -> Teams -> Users" navigation scenario.
    public List<TeamDetailVm> Teams { get; set; } = new();
}

public class CustomerListItemVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class CustomerDetailVm
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public List<ProjectListItemVm> Projects { get; set; } = new();
}
