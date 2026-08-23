using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface ITagRepository
{
    Task<List<TagModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<TagModel?> GetByIdAsync(string id);
    Task<TagModel> InsertAsync(TagModel entity);
    Task<TagModel?> UpdateAsync(string id, TagModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<TagModel>? filter = null);
    Task<List<TagModel>> GetByIdsAsync(IEnumerable<string> ids);
}
