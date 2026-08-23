using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface IProjectRepository
{
    Task<List<ProjectModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<ProjectModel?> GetByIdAsync(string id);
    Task<ProjectModel> InsertAsync(ProjectModel entity);
    Task<ProjectModel?> UpdateAsync(string id, ProjectModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<ProjectModel>? filter = null);
    Task<List<ProjectModel>> GetByCustomerIdAsync(string customerId, int skip = 0, int limit = 100);
    Task<List<ProjectModel>> GetByStatusAsync(string status, int skip = 0, int limit = 20);
}
