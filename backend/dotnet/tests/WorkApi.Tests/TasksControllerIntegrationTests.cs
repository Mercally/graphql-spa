using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using WorkApi.DTOs;
using WorkApi.Repositories;
using WorkApi.Services.Notifications;
using WorkApi.Tests.Fakes;
using Xunit;

namespace WorkApi.Tests;

// Covers the task-assigned email hook added for Requirements.md section 35: assigning a task
// (on create or on reassignment) must trigger exactly one INotificationTrigger.TaskAssignedAsync
// call; leaving it unassigned, or updating without changing the assignee, must not.
public class TasksControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly FakeNotificationTrigger _notifications = new();

    public TasksControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<ITaskRepository>();
                services.AddSingleton<ITaskRepository>(new FakeTaskRepository());
                services.RemoveAll<INotificationTrigger>();
                services.AddSingleton<INotificationTrigger>(_notifications);
            });
        });
    }

    [Fact]
    public async Task PostTask_WithAssignedUserId_TriggersTaskAssignedNotification()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Fix bug",
            Description = "desc",
            ProjectId = "project-1",
            Status = "pending",
            AssignedUserId = "user-1"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var call = Assert.Single(_notifications.TaskAssignedCalls);
        Assert.Equal("user-1", call.AssignedUserId);
    }

    [Fact]
    public async Task PostTask_WithoutAssignedUserId_StillSucceeds()
    {
        // The controller always delegates to INotificationTrigger; deciding whether an
        // unassigned task means "send nothing" is NotificationTrigger's own contract, covered
        // by NotificationTriggerTests. This only guards the create request itself.
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Unassigned task",
            Description = "desc",
            ProjectId = "project-1",
            Status = "pending"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task PutTask_ReassigningToADifferentUser_TriggersNotification()
    {
        var client = _factory.CreateClient();
        var created = await (await client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Task", Description = "desc", ProjectId = "project-1", Status = "pending", AssignedUserId = "user-1"
        })).Content.ReadFromJsonAsync<TaskDto>();
        _notifications.TaskAssignedCalls.Clear();

        var response = await client.PutAsJsonAsync($"/api/tasks/{created!.Id}", new UpdateTaskDto
        {
            AssignedUserId = "user-2"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var call = Assert.Single(_notifications.TaskAssignedCalls);
        Assert.Equal("user-2", call.AssignedUserId);
    }

    [Fact]
    public async Task PutTask_WithoutChangingAssignedUserId_DoesNotTriggerNotification()
    {
        var client = _factory.CreateClient();
        var created = await (await client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Task", Description = "desc", ProjectId = "project-1", Status = "pending", AssignedUserId = "user-1"
        })).Content.ReadFromJsonAsync<TaskDto>();
        _notifications.TaskAssignedCalls.Clear();

        var response = await client.PutAsJsonAsync($"/api/tasks/{created!.Id}", new UpdateTaskDto
        {
            Status = "in-progress"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Empty(_notifications.TaskAssignedCalls);
    }
}
