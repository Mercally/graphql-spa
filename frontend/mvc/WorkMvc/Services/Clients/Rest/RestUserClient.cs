using WorkMvc.Models.View;
using WorkMvc.Services.Rest;

namespace WorkMvc.Services.Clients.Rest;

public class RestUserClient : IUserDataClient
{
    private readonly IRestGateway _gateway;

    public RestUserClient(IRestGateway gateway) => _gateway = gateway;

    // 1 REST call.
    public async Task<UserVm?> GetByIdAsync(string id)
    {
        var user = await _gateway.GetSingleAsync<UserRestDto>($"/api/users/{id}").ConfigureAwait(false);
        return user == null ? null : new UserVm { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role };
    }
}
