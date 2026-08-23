using MongoDB.Driver;
using WorkApi.Models;

namespace WorkApi.Repositories;

public interface ICommentRepository
{
    Task<List<CommentModel>> GetAllAsync(int skip = 0, int limit = 20);
    Task<CommentModel?> GetByIdAsync(string id);
    Task<CommentModel> InsertAsync(CommentModel entity);
    Task<CommentModel?> UpdateAsync(string id, CommentModel entity);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<CommentModel>? filter = null);
    Task<List<CommentModel>> GetByTaskIdAsync(string taskId, int skip = 0, int limit = 20);
    Task<List<CommentModel>> GetByUserIdAsync(string userId, int skip = 0, int limit = 20);
}
