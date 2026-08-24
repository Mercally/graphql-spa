using WorkApi.Models;
using WorkApi.Services.Notifications;

namespace WorkApi.Tests.Fakes;

// Records calls instead of hitting a real gRPC channel, so controller/resolver tests can assert
// a notification was (or wasn't) triggered without needing NotificationService running.
public class FakeNotificationTrigger : INotificationTrigger
{
    public List<TaskModel> TaskAssignedCalls { get; } = new();
    public List<UserModel> UserWelcomeCalls { get; } = new();

    public Task TaskAssignedAsync(TaskModel task)
    {
        TaskAssignedCalls.Add(task);
        return Task.CompletedTask;
    }

    public Task UserWelcomeAsync(UserModel user)
    {
        UserWelcomeCalls.Add(user);
        return Task.CompletedTask;
    }
}
