using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface ITaskRepository
{
    Task<List<TaskModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<TaskModel?> GetByIdAsync(string id);
    Task<TaskModel> InsertAsync(TaskModel entity);
    Task<TaskModel?> UpdateAsync(string id, TaskModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<TaskModel>? filter = null);
    Task<List<TaskModel>> GetByProjectIdAsync(string projectId, int skip = 0, int limit = 100);
    Task<List<TaskModel>> GetByStatusAsync(string status, int skip = 0, int limit = 20);
    Task<List<TaskModel>> GetByAssignedUserIdAsync(string assignedUserId, int skip = 0, int limit = 20);
}
