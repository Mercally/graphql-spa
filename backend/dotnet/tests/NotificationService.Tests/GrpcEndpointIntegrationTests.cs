using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc.Testing;
using NotificationService.Protos;
using Xunit;

namespace NotificationService.Tests;

// Exercises the real gRPC wire path (Kestrel + HTTP/2 + protobuf (de)serialization) that the
// EmailNotifierServiceTests unit tests skip - this is what actually proves WorkApi's generated
// client and this server agree on the .proto contract end to end.
public class GrpcEndpointIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public GrpcEndpointIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task SendEmail_OverRealGrpcChannel_ReturnsAcceptedAck()
    {
        var channel = GrpcChannel.ForAddress(_factory.Server.BaseAddress, new GrpcChannelOptions
        {
            HttpHandler = _factory.Server.CreateHandler()
        });
        var client = new EmailNotifier.EmailNotifierClient(channel);

        var ack = await client.SendEmailAsync(new SendEmailRequest
        {
            To = "alice@mailinator.com",
            Subject = "Task assigned: Fix bug",
            Body = "You have been assigned to \"Fix bug\"."
        });

        Assert.True(ack.Accepted);
        Assert.False(string.IsNullOrWhiteSpace(ack.MessageId));
    }
}
