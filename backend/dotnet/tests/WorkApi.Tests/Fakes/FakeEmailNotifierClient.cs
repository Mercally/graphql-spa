using Grpc.Core;
using Grpc.Core.Testing;
using NotificationService.Protos;

namespace WorkApi.Tests.Fakes;

// EmailNotifier.EmailNotifierClient's SendEmailAsync is generated virtual specifically so it can
// be subclassed like this in tests (protected parameterless base ctor, same pattern grpc-dotnet
// docs recommend) - lets NotificationTrigger be unit-tested without a running gRPC server.
public class FakeEmailNotifierClient : EmailNotifier.EmailNotifierClient
{
    public List<SendEmailRequest> Sent { get; } = new();

    public override AsyncUnaryCall<SendEmailAck> SendEmailAsync(SendEmailRequest request, CallOptions options)
    {
        Sent.Add(request);
        var ack = new SendEmailAck { Accepted = true, MessageId = Guid.NewGuid().ToString() };
        return TestCalls.AsyncUnaryCall(
            Task.FromResult(ack),
            Task.FromResult(new Metadata()),
            () => Status.DefaultSuccess,
            () => new Metadata(),
            () => { });
    }
}
