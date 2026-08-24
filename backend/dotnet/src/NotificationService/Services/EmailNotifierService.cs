using Grpc.Core;
using NotificationService.Protos;

namespace NotificationService.Services;

// Simulated email sender: no SMTP, no API key, no outbound network call - it only logs what
// would have been sent and acks. Real delivery config is intentionally out of scope for now
// (see Requirements.md section 35).
public class EmailNotifierService : EmailNotifier.EmailNotifierBase
{
    private readonly ILogger<EmailNotifierService> _logger;

    public EmailNotifierService(ILogger<EmailNotifierService> logger)
    {
        _logger = logger;
    }

    public override Task<SendEmailAck> SendEmail(SendEmailRequest request, ServerCallContext context)
    {
        var messageId = Guid.NewGuid().ToString();
        _logger.LogInformation(
            "Simulated email sent to {To}: {Subject} (messageId={MessageId})\n{Body}",
            request.To, request.Subject, messageId, request.Body);

        return Task.FromResult(new SendEmailAck { Accepted = true, MessageId = messageId });
    }
}
