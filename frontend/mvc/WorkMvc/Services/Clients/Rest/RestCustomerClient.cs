using WorkMvc.Models.View;
using WorkMvc.Services.Rest;

namespace WorkMvc.Services.Clients.Rest;

/// <summary>
/// REST implementation: fetching a customer with its projects takes 2 separate HTTP calls
/// (GET /api/customers/{id}, then GET /api/projects?customerId={id}) - this is the smallest,
/// most direct illustration of Requirements.md section 4's "REST needs multiple requests"
/// point, visible via the request counter shown on the Customer Details page.
/// </summary>
public class RestCustomerClient : ICustomerDataClient
{
    private readonly IRestGateway _gateway;

    public RestCustomerClient(IRestGateway gateway) => _gateway = gateway;

    public async Task<List<CustomerListItemVm>> GetAllAsync()
    {
        var items = await _gateway.GetListAsync<CustomerRestDto>("/api/customers", 0, 50).ConfigureAwait(false);
        return items.Select(c => new CustomerListItemVm { Id = c.Id, Name = c.Name, Email = c.Email }).ToList();
    }

    public async Task<CustomerDetailVm?> GetByIdAsync(string id)
    {
        var customer = await _gateway.GetSingleAsync<CustomerRestDto>($"/api/customers/{id}").ConfigureAwait(false);
        if (customer == null) return null;

        var projects = await _gateway.GetListAsync<ProjectRestDto>(
            "/api/projects", 0, 100, new Dictionary<string, string?> { ["customerId"] = id }).ConfigureAwait(false);

        return new CustomerDetailVm
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Projects = projects.Select(p => new ProjectListItemVm { Id = p.Id, Name = p.Name, Status = p.Status }).ToList()
        };
    }
}
