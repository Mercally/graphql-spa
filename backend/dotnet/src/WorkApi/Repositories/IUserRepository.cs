using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface IUserRepository
{
    Task<List<UserModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<UserModel?> GetByIdAsync(string id);
    Task<UserModel> InsertAsync(UserModel entity);
    Task<UserModel?> UpdateAsync(string id, UserModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<UserModel>? filter = null);
    Task<List<UserModel>> GetByRoleAsync(string role, int skip = 0, int limit = 20);
    Task<List<UserModel>> GetByIdsAsync(IEnumerable<string> ids);
}
