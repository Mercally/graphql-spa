using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class TeamRepository : RepositoryBase<TeamModel>, ITeamRepository
{
    public TeamRepository(IMongoDatabase database) : base(database, "teams")
    {
    }

    public Task<List<TeamModel>> GetByProjectIdAsync(string projectId, int skip = 0, int limit = 100)
    {
        var filter = Builders<TeamModel>.Filter.Eq(x => x.ProjectId, projectId);
        return FindAsync(filter, skip, limit);
    }
}
