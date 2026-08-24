using Microsoft.Extensions.Logging.Abstractions;
using WorkApi.Models;
using WorkApi.Services.Notifications;
using WorkApi.Tests.Fakes;
using Xunit;

namespace WorkApi.Tests;

// Unit tests for the actual guard logic in NotificationTrigger (Requirements.md section 35):
// it decides whether an email is sent at all, and must never let a gRPC failure escape.
public class NotificationTriggerTests
{
    private static (NotificationTrigger Trigger, FakeEmailNotifierClient Client, FakeUserRepository Users) Build()
    {
        var client = new FakeEmailNotifierClient();
        var users = new FakeUserRepository();
        var trigger = new NotificationTrigger(client, users, NullLogger<NotificationTrigger>.Instance);
        return (trigger, client, users);
    }

    [Fact]
    public async Task TaskAssignedAsync_WithNoAssignedUserId_SendsNothing()
    {
        var (trigger, client, _) = Build();

        await trigger.TaskAssignedAsync(new TaskModel { Title = "Unassigned", AssignedUserId = null });

        Assert.Empty(client.Sent);
    }

    [Fact]
    public async Task TaskAssignedAsync_WithAssignedUserId_SendsToThatUsersEmail()
    {
        var (trigger, client, users) = Build();
        var user = await users.InsertAsync(new UserModel { Name = "Alice", Email = "alice@mailinator.com" });

        await trigger.TaskAssignedAsync(new TaskModel { Title = "Fix bug", AssignedUserId = user.Id });

        var sent = Assert.Single(client.Sent);
        Assert.Equal("alice@mailinator.com", sent.To);
        Assert.Contains("Fix bug", sent.Subject);
    }

    [Fact]
    public async Task TaskAssignedAsync_WhenAssignedUserDoesNotExist_SendsNothingAndDoesNotThrow()
    {
        var (trigger, client, _) = Build();

        await trigger.TaskAssignedAsync(new TaskModel { Title = "Orphaned", AssignedUserId = "missing-user" });

        Assert.Empty(client.Sent);
    }

    [Fact]
    public async Task UserWelcomeAsync_SendsToTheUsersEmail()
    {
        var (trigger, client, _) = Build();

        await trigger.UserWelcomeAsync(new UserModel { Id = "1", Name = "Bob", Email = "bob@mailinator.com" });

        var sent = Assert.Single(client.Sent);
        Assert.Equal("bob@mailinator.com", sent.To);
    }
}
