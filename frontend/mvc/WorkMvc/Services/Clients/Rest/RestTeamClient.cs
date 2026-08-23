using WorkMvc.Models.View;
using WorkMvc.Services.Rest;

namespace WorkMvc.Services.Clients.Rest;

public class RestTeamClient : ITeamDataClient
{
    private readonly IRestGateway _gateway;

    public RestTeamClient(IRestGateway gateway) => _gateway = gateway;

    // 2 REST calls: the team itself, then a full users fetch to resolve member names.
    public async Task<TeamDetailVm?> GetByIdAsync(string id)
    {
        var team = await _gateway.GetSingleAsync<TeamRestDto>($"/api/teams/{id}").ConfigureAwait(false);
        if (team == null) return null;

        var users = await _gateway.GetListAsync<UserRestDto>("/api/users", 0, 200).ConfigureAwait(false);
        var usersById = users.ToDictionary(u => u.Id);

        return new TeamDetailVm
        {
            Id = team.Id,
            Name = team.Name,
            ProjectId = team.ProjectId,
            Users = team.MemberUserIds.Where(usersById.ContainsKey)
                .Select(uid => usersById[uid])
                .Select(u => new UserVm { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role })
                .ToList()
        };
    }
}
