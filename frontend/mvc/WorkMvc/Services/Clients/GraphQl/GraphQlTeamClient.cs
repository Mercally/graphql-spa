using System.Text.Json;
using WorkMvc.Models.View;
using WorkMvc.Services.GraphQl;

namespace WorkMvc.Services.Clients.GraphQl;

public class GraphQlTeamClient : ITeamDataClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private const string DetailQuery = @"
        query TeamDetail($id: ID!) {
            team(id: $id) {
                id
                name
                projectId
                users { id name email role }
            }
        }";

    private readonly IGraphQlGateway _gateway;

    public GraphQlTeamClient(IGraphQlGateway gateway) => _gateway = gateway;

    public async Task<TeamDetailVm?> GetByIdAsync(string id)
    {
        var data = await _gateway.ExecuteAsync(DetailQuery, new { id }, "team+users").ConfigureAwait(false);
        var teamProp = data.GetProperty("team");
        if (teamProp.ValueKind == JsonValueKind.Null) return null;

        var team = teamProp.Deserialize<GqlTeamDetail>(JsonOptions)!;
        return new TeamDetailVm
        {
            Id = team.Id,
            Name = team.Name,
            ProjectId = team.ProjectId,
            Users = team.Users.Select(u => new UserVm { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role }).ToList()
        };
    }
}
