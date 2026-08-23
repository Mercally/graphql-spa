using System.Text.Json;
using WorkMvc.Models.View;
using WorkMvc.Services.GraphQl;

namespace WorkMvc.Services.Clients.GraphQl;

/// <summary>
/// GraphQL implementation: the customer + its projects come back from a single POST
/// /graphql request, unlike the REST client's 2 calls for the same information.
/// </summary>
public class GraphQlCustomerClient : ICustomerDataClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private const string ListQuery = "query { customers(limit: 50) { id name email } }";

    // The id is inlined as a GraphQL string literal rather than passed as a $variable: the
    // .NET schema declares customer(id: String!) while the Node schema declares
    // customer(id: ID!) - GraphQL's strict "variable type must exactly match argument type"
    // rule would reject a single $id: ID!/$id: String! variable against whichever backend
    // doesn't use that exact type, but a plain string literal coerces to either String or ID
    // argument type without complaint, so one query works unchanged against both backends.
    private static string DetailQuery(string id) => $@"
        query {{
            customer(id: {Literal(id)}) {{
                id
                name
                email
                projects {{ id name status }}
            }}
        }}";

    private readonly IGraphQlGateway _gateway;

    public GraphQlCustomerClient(IGraphQlGateway gateway) => _gateway = gateway;

    private static string Literal(string s) => System.Text.Json.JsonSerializer.Serialize(s);

    public async Task<List<CustomerListItemVm>> GetAllAsync()
    {
        var data = await _gateway.ExecuteAsync(ListQuery, operationLabel: "customers").ConfigureAwait(false);
        var customers = data.GetProperty("customers").Deserialize<List<GqlCustomerBrief>>(JsonOptions) ?? new();
        return customers.Select(c => new CustomerListItemVm { Id = c.Id, Name = c.Name, Email = c.Email }).ToList();
    }

    public async Task<CustomerDetailVm?> GetByIdAsync(string id)
    {
        var data = await _gateway.ExecuteAsync(DetailQuery(id), operationLabel: "customer+projects").ConfigureAwait(false);
        var customerProp = data.GetProperty("customer");
        if (customerProp.ValueKind == JsonValueKind.Null) return null;

        var customer = customerProp.Deserialize<GqlCustomerDetail>(JsonOptions)!;
        return new CustomerDetailVm
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Projects = customer.Projects.Select(p => new ProjectListItemVm { Id = p.Id, Name = p.Name, Status = p.Status }).ToList()
        };
    }
}
