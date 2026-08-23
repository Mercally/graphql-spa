using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class TaskRepository : RepositoryBase<TaskModel>, ITaskRepository
{
    public TaskRepository(IMongoDatabase database) : base(database, "tasks")
    {
    }

    public Task<List<TaskModel>> GetByProjectIdAsync(string projectId, int skip = 0, int limit = 100)
    {
        var filter = Builders<TaskModel>.Filter.Eq(x => x.ProjectId, projectId);
        return FindAsync(filter, skip, limit);
    }

    public Task<List<TaskModel>> GetByStatusAsync(string status, int skip = 0, int limit = 20)
    {
        var filter = Builders<TaskModel>.Filter.Eq(x => x.Status, status);
        return FindAsync(filter, skip, limit);
    }

    public Task<List<TaskModel>> GetByAssignedUserIdAsync(string assignedUserId, int skip = 0, int limit = 20)
    {
        var filter = Builders<TaskModel>.Filter.Eq(x => x.AssignedUserId, assignedUserId);
        return FindAsync(filter, skip, limit);
    }
}
