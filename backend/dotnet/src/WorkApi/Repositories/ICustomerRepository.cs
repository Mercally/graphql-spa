using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface ICustomerRepository
{
    Task<List<CustomerModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<CustomerModel?> GetByIdAsync(string id);
    Task<CustomerModel> InsertAsync(CustomerModel entity);
    Task<CustomerModel?> UpdateAsync(string id, CustomerModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<CustomerModel>? filter = null);
    Task<List<CustomerModel>> GetByNameAsync(string name, int skip = 0, int limit = 20);
}
