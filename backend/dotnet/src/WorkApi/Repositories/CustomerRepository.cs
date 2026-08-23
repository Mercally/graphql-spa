using MongoDB.Bson;
using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class CustomerRepository : RepositoryBase<CustomerModel>, ICustomerRepository
{
    public CustomerRepository(IMongoDatabase database) : base(database, "customers")
    {
    }

    public Task<List<CustomerModel>> GetByNameAsync(string name, int skip = 0, int limit = 20)
    {
        var filter = Builders<CustomerModel>.Filter.Regex(x => x.Name, new BsonRegularExpression(name, "i"));
        return FindAsync(filter, skip, limit);
    }
}
