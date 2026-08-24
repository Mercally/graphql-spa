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

// Covers the welcome-email hook added for Requirements.md section 35: creating a user must
// trigger exactly one INotificationTrigger.UserWelcomeAsync call, using a fake so no real gRPC
// channel is needed.
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly FakeNotificationTrigger _notifications = new();

    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IUserRepository>();
                services.AddSingleton<IUserRepository>(new FakeUserRepository());
                services.RemoveAll<INotificationTrigger>();
                services.AddSingleton<INotificationTrigger>(_notifications);
            });
        });
    }

    [Fact]
    public async Task PostUser_TriggersWelcomeNotification_ForTheCreatedUser()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/users", new CreateUserDto
        {
            Name = "Alice",
            Email = "alice@mailinator.com",
            Role = "Developer"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(created);

        var call = Assert.Single(_notifications.UserWelcomeCalls);
        Assert.Equal("alice@mailinator.com", call.Email);
        Assert.Equal(created!.Id, call.Id);
    }
}
