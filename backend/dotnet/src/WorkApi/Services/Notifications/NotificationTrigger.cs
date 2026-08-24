using NotificationService.Protos;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Services.Notifications;

// Calls the NotificationService over gRPC to simulate sending an email. A failure here must
// never break the create/assign request that triggered it (Requirements.md section 35), so
// every call is awaited but wrapped - exceptions are logged, never rethrown.
public class NotificationTrigger : INotificationTrigger
{
    private readonly EmailNotifier.EmailNotifierClient _client;
    private readonly IUserRepository _userRepo;
    private readonly ILogger<NotificationTrigger> _logger;

    public NotificationTrigger(EmailNotifier.EmailNotifierClient client, IUserRepository userRepo, ILogger<NotificationTrigger> logger)
    {
        _client = client;
        _userRepo = userRepo;
        _logger = logger;
    }

    public async Task TaskAssignedAsync(TaskModel task)
    {
        if (string.IsNullOrEmpty(task.AssignedUserId)) return;

        try
        {
            var user = await _userRepo.GetByIdAsync(task.AssignedUserId).ConfigureAwait(false);
            if (user == null || string.IsNullOrEmpty(user.Email)) return;

            await _client.SendEmailAsync(new SendEmailRequest
            {
                To = user.Email,
                Subject = $"Task assigned: {task.Title}",
                Body = $"You have been assigned to \"{task.Title}\"."
            }).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to send task-assigned notification for task {TaskId}", task.Id);
        }
    }

    public async Task UserWelcomeAsync(UserModel user)
    {
        if (string.IsNullOrEmpty(user.Email)) return;

        try
        {
            await _client.SendEmailAsync(new SendEmailRequest
            {
                To = user.Email,
                Subject = "Welcome!",
                Body = $"Welcome, {user.Name}!"
            }).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to send welcome notification for user {UserId}", user.Id);
        }
    }
}
