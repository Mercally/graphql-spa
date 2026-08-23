using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface ITeamRepository
{
    Task<List<TeamModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<TeamModel?> GetByIdAsync(string id);
    Task<TeamModel> InsertAsync(TeamModel entity);
    Task<TeamModel?> UpdateAsync(string id, TeamModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<TeamModel>? filter = null);
    Task<List<TeamModel>> GetByProjectIdAsync(string projectId, int skip = 0, int limit = 100);
}
