using MongoDB.Bson;
using MongoDB.Driver;

namespace WorkApi.Repositories;

/// <summary>
/// Shared MongoDB CRUD implementation for a single collection. Entity-specific repositories
/// derive from this to get GetAll/GetById/Insert/Update/Delete/Count "for free" and add their
/// own filtered lookups (by customerId, status, etc.) on top via <see cref="FindAsync"/>.
/// </summary>
public abstract class RepositoryBase<TModel> where TModel : class
{
    protected readonly IMongoCollection<TModel> Collection;

    protected RepositoryBase(IMongoDatabase database, string collectionName)
    {
        Collection = database.GetCollection<TModel>(collectionName);
    }

    public virtual async Task<List<TModel>> GetAllAsync(int skip = 0, int limit = 20)
    {
        return await FindAsync(Builders<TModel>.Filter.Empty, skip, limit).ConfigureAwait(false);
    }

    public virtual async Task<TModel?> GetByIdAsync(string id)
    {
        var filter = IdFilter(id);
        if (filter == null) return null;
        return await Collection.Find(filter).FirstOrDefaultAsync().ConfigureAwait(false);
    }

    public virtual async Task<TModel> InsertAsync(TModel entity)
    {
        await Collection.InsertOneAsync(entity).ConfigureAwait(false);
        return entity;
    }

    public virtual async Task<TModel?> UpdateAsync(string id, TModel entity)
    {
        var filter = IdFilter(id);
        if (filter == null) return null;
        var result = await Collection.ReplaceOneAsync(filter, entity).ConfigureAwait(false);
        if (result.MatchedCount == 0)
            return null;
        return await GetByIdAsync(id).ConfigureAwait(false);
    }

    public virtual async Task<bool> DeleteAsync(string id)
    {
        var filter = IdFilter(id);
        if (filter == null) return false;
        var result = await Collection.DeleteOneAsync(filter).ConfigureAwait(false);
        return result.DeletedCount > 0;
    }

    public virtual async Task<long> CountAsync(FilterDefinition<TModel>? filter = null)
    {
        filter ??= Builders<TModel>.Filter.Empty;
        return await Collection.CountDocumentsAsync(filter).ConfigureAwait(false);
    }

    protected async Task<List<TModel>> FindAsync(FilterDefinition<TModel> filter, int skip = 0, int limit = 20)
    {
        return await Collection.Find(filter)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    protected async Task<List<TModel>> FindByIdsAsync(IEnumerable<string> ids)
    {
        var objectIds = ids
            .Where(id => !string.IsNullOrEmpty(id))
            .Distinct()
            .Select(id => ObjectId.TryParse(id, out var oid) ? oid : (ObjectId?)null)
            .Where(oid => oid.HasValue)
            .Select(oid => oid!.Value)
            .ToList();
        if (objectIds.Count == 0) return new List<TModel>();
        var filter = Builders<TModel>.Filter.In("_id", objectIds);
        return await Collection.Find(filter).ToListAsync().ConfigureAwait(false);
    }

    /// <summary>
    /// Builds an "_id" equality filter against the raw ObjectId, rather than the string
    /// representation. The Mongo C# driver's string-keyed Filter.Eq("_id", stringId) does not
    /// reliably route through the class map's [BsonRepresentation(BsonType.ObjectId)] conversion
    /// for every query shape, which silently produced 0 matches against real ObjectId _id values.
    /// Parsing to ObjectId explicitly avoids that ambiguity. Returns null for a malformed id so
    /// callers can treat it as "not found" instead of throwing.
    /// </summary>
    private static FilterDefinition<TModel>? IdFilter(string id)
    {
        return ObjectId.TryParse(id, out var objectId)
            ? Builders<TModel>.Filter.Eq("_id", objectId)
            : null;
    }
}
