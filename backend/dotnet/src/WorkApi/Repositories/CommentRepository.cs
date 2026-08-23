using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public class CommentRepository : RepositoryBase<CommentModel>, ICommentRepository
{
    public CommentRepository(IMongoDatabase database) : base(database, "comments")
    {
    }

    public Task<List<CommentModel>> GetByTaskIdAsync(string taskId, int skip = 0, int limit = 20)
    {
        var filter = Builders<CommentModel>.Filter.Eq(x => x.TaskId, taskId);
        return FindAsync(filter, skip, limit);
    }

    public Task<List<CommentModel>> GetByUserIdAsync(string userId, int skip = 0, int limit = 20)
    {
        var filter = Builders<CommentModel>.Filter.Eq(x => x.UserId, userId);
        return FindAsync(filter, skip, limit);
    }
}
