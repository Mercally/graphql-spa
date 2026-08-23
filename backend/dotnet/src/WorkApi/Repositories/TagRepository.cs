using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class TagRepository : RepositoryBase<TagModel>, ITagRepository
{
    public TagRepository(IMongoDatabase database) : base(database, "tags")
    {
    }

    public Task<List<TagModel>> GetByIdsAsync(IEnumerable<string> ids) => FindByIdsAsync(ids);
}
