using WorkApi.Models;

namespace WorkApi.Services.Notifications;

public interface INotificationTrigger
{
    Task TaskAssignedAsync(TaskModel task);
    Task UserWelcomeAsync(UserModel user);
}
