using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class ProjectRepository : RepositoryBase<ProjectModel>, IProjectRepository
{
    public ProjectRepository(IMongoDatabase database) : base(database, "projects")
    {
    }

    public Task<List<ProjectModel>> GetByCustomerIdAsync(string customerId, int skip = 0, int limit = 100)
    {
        var filter = Builders<ProjectModel>.Filter.Eq(x => x.CustomerId, customerId);
        return FindAsync(filter, skip, limit);
    }

    public Task<List<ProjectModel>> GetByStatusAsync(string status, int skip = 0, int limit = 20)
    {
        var filter = Builders<ProjectModel>.Filter.Eq(x => x.Status, status);
        return FindAsync(filter, skip, limit);
    }
}
