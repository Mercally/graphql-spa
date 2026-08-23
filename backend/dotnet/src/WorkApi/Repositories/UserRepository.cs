using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class UserRepository : RepositoryBase<UserModel>, IUserRepository
{
    public UserRepository(IMongoDatabase database) : base(database, "users")
    {
    }

    public Task<List<UserModel>> GetByRoleAsync(string role, int skip = 0, int limit = 20)
    {
        var filter = Builders<UserModel>.Filter.Eq(x => x.Role, role);
        return FindAsync(filter, skip, limit);
    }

    public Task<List<UserModel>> GetByIdsAsync(IEnumerable<string> ids) => FindByIdsAsync(ids);
}
