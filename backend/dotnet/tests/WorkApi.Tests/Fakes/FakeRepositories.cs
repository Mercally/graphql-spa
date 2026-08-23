using MongoDB.Driver;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Tests.Fakes;

// Simple in-memory test doubles for the repository interfaces. These exist so unit/integration
// tests do not need a live MongoDB instance: they implement the same contracts the real
// Mongo-backed repositories do, backed by a plain List<T> instead of a collection.

public class FakeCustomerRepository : ICustomerRepository
{
    public List<CustomerModel> Items { get; } = new();
    private int _nextId = 1;

    public Task<List<CustomerModel>> GetAllAsync(int skip = 0, int limit = 20) =>
        Task.FromResult(Items.Skip(skip).Take(limit).ToList());

    public Task<CustomerModel?> GetByIdAsync(string id) =>
        Task.FromResult(Items.FirstOrDefault(x => x.Id == id));

    public Task<CustomerModel> InsertAsync(CustomerModel entity)
    {
        entity.Id ??= (_nextId++).ToString();
        Items.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<CustomerModel?> UpdateAsync(string id, CustomerModel entity)
    {
        var existing = Items.FirstOrDefault(x => x.Id == id);
        if (existing == null) return Task.FromResult<CustomerModel?>(null);
        Items.Remove(existing);
        entity.Id = id;
        Items.Add(entity);
        return Task.FromResult<CustomerModel?>(entity);
    }

    public Task<bool> DeleteAsync(string id)
    {
        var existing = Items.FirstOrDefault(x => x.Id == id);
        if (existing == null) return Task.FromResult(false);
        Items.Remove(existing);
        return Task.FromResult(true);
    }

    public Task<long> CountAsync(FilterDefinition<CustomerModel>? filter = null) =>
        Task.FromResult((long)Items.Count);

    public Task<List<CustomerModel>> GetByNameAsync(string name, int skip = 0, int limit = 20) =>
        Task.FromResult(Items.Where(x => x.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
            .Skip(skip).Take(limit).ToList());
}

public class FakeTaskRepository : ITaskRepository
{
    public List<TaskModel> Items { get; } = new();

    public Task<List<TaskModel>> GetAllAsync(int skip = 0, int limit = 20) =>
        Task.FromResult(Items.Skip(skip).Take(limit).ToList());

    public Task<TaskModel?> GetByIdAsync(string id) =>
        Task.FromResult(Items.FirstOrDefault(x => x.Id == id));

    public Task<TaskModel> InsertAsync(TaskModel entity)
    {
        Items.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<TaskModel?> UpdateAsync(string id, TaskModel entity) =>
        Task.FromResult<TaskModel?>(entity);

    public Task<bool> DeleteAsync(string id) => Task.FromResult(true);

    public Task<long> CountAsync(FilterDefinition<TaskModel>? filter = null) =>
        Task.FromResult((long)Items.Count);

    public Task<List<TaskModel>> GetByProjectIdAsync(string projectId, int skip = 0, int limit = 100) =>
        Task.FromResult(Items.Where(x => x.ProjectId == projectId).Skip(skip).Take(limit).ToList());

    public Task<List<TaskModel>> GetByStatusAsync(string status, int skip = 0, int limit = 20) =>
        Task.FromResult(Items.Where(x => x.Status == status).Skip(skip).Take(limit).ToList());

    public Task<List<TaskModel>> GetByAssignedUserIdAsync(string assignedUserId, int skip = 0, int limit = 20) =>
        Task.FromResult(Items.Where(x => x.AssignedUserId == assignedUserId).Skip(skip).Take(limit).ToList());
}
