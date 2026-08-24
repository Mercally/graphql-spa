using Microsoft.AspNetCore.Server.Kestrel.Core;
using NotificationService.Services;

var builder = WebApplication.CreateBuilder(args);

// gRPC needs HTTP/2. Without TLS there's no ALPN to negotiate it per-connection, so every
// endpoint has to be pinned to Http2 explicitly (h2c) - this is a gRPC-only service, no REST.
builder.WebHost.ConfigureKestrel(options =>
{
    options.ConfigureEndpointDefaults(listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http2;
    });
});

builder.Services.AddGrpc();

var app = builder.Build();

app.MapGrpcService<EmailNotifierService>();

app.Run();

// Exposes the top-level Program for WebApplicationFactory<Program> in tests.
public partial class Program { }
