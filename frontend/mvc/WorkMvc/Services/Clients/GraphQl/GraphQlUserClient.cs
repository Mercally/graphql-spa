using System.Text.Json;
using WorkMvc.Models.View;
using WorkMvc.Services.GraphQl;

namespace WorkMvc.Services.Clients.GraphQl;

public class GraphQlUserClient : IUserDataClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private const string DetailQuery = "query UserDetail($id: ID!) { user(id: $id) { id name email role } }";

    private readonly IGraphQlGateway _gateway;

    public GraphQlUserClient(IGraphQlGateway gateway) => _gateway = gateway;

    public async Task<UserVm?> GetByIdAsync(string id)
    {
        var data = await _gateway.ExecuteAsync(DetailQuery, new { id }, "user").ConfigureAwait(false);
        var userProp = data.GetProperty("user");
        if (userProp.ValueKind == JsonValueKind.Null) return null;

        var user = userProp.Deserialize<GqlUser>(JsonOptions)!;
        return new UserVm { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role };
    }
}
