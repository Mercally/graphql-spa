using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;
using WorkApi.Tests.Fakes;
using Xunit;

namespace WorkApi.Tests;

// Integration test driven through WebApplicationFactory<Program>, exercising the real ASP.NET
// pipeline (routing, model binding, controller, JSON serialization). The real Mongo-backed
// ICustomerRepository is swapped for an in-memory fake so the test runs without needing a live
// MongoDB instance or Docker - keeping it fast and CI-friendly for this PoC.
public class CustomersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CustomersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<ICustomerRepository>();
                services.AddSingleton<ICustomerRepository>(new FakeCustomerRepository());
            });
        });
    }

    [Fact]
    public async Task GetCustomers_ReturnsOkWithEmptyPaginatedList_WhenNoCustomersExist()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/customers");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<PaginatedList<CustomerDto>>();
        Assert.NotNull(body);
        Assert.Empty(body!.Items);
    }

    [Fact]
    public async Task PostThenGetCustomer_RoundTripsThroughTheApi()
    {
        var client = _factory.CreateClient();

        var createResponse = await client.PostAsJsonAsync("/api/customers", new CreateCustomerDto
        {
            Name = "Integration Test Co",
            Email = "int-test@example.com"
        });

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<CustomerDto>();
        Assert.NotNull(created);

        var getResponse = await client.GetAsync($"/api/customers/{created!.Id}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetched = await getResponse.Content.ReadFromJsonAsync<CustomerDto>();
        Assert.Equal("Integration Test Co", fetched!.Name);
    }

    [Fact]
    public async Task GetCustomer_ReturnsNotFound_WhenIdDoesNotExist()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/customers/does-not-exist");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
