using Grpc.Core;
using Grpc.Core.Testing;
using Microsoft.Extensions.Logging.Abstractions;
using NotificationService.Protos;
using NotificationService.Services;
using Xunit;

namespace NotificationService.Tests;

// EmailNotifierService only simulates delivery (Requirements.md section 35) - no network call,
// no config - so these tests just verify it always acks and never actually sends anything.
public class EmailNotifierServiceTests
{
    private static ServerCallContext CreateContext() => TestServerCallContext.Create(
        method: "SendEmail", host: null, deadline: DateTime.UtcNow.AddMinutes(1), requestHeaders: new Metadata(),
        cancellationToken: CancellationToken.None, peer: "test-peer", authContext: null,
        contextPropagationToken: null, writeHeadersFunc: _ => Task.CompletedTask,
        writeOptionsGetter: () => new WriteOptions(), writeOptionsSetter: _ => { });

    [Fact]
    public async Task SendEmail_AlwaysAccepts_WithAGeneratedMessageId()
    {
        var service = new EmailNotifierService(NullLogger<EmailNotifierService>.Instance);
        var request = new SendEmailRequest { To = "alice@mailinator.com", Subject = "Task assigned: Fix bug", Body = "You have been assigned." };

        var ack = await service.SendEmail(request, CreateContext());

        Assert.True(ack.Accepted);
        Assert.False(string.IsNullOrWhiteSpace(ack.MessageId));
    }

    [Fact]
    public async Task SendEmail_GeneratesADifferentMessageId_PerCall()
    {
        var service = new EmailNotifierService(NullLogger<EmailNotifierService>.Instance);
        var request = new SendEmailRequest { To = "bob@mailinator.com", Subject = "Welcome!", Body = "Welcome, Bob!" };

        var first = await service.SendEmail(request, CreateContext());
        var second = await service.SendEmail(request, CreateContext());

        Assert.NotEqual(first.MessageId, second.MessageId);
    }
}
