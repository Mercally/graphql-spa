using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Services;

public interface IWorkDomainService
{
    Task<IEnumerable<CustomerModel>> GetCustomersAsync(int skip = 0, int limit = 20);
    Task<IEnumerable<ProjectModel>> GetProjectsAsync(int skip = 0, int limit = 20);
    Task<IEnumerable<TeamModel>> GetTeamsAsync(int skip = 0, int limit = 20);
    Task<IEnumerable<UserModel>> GetUsersAsync(int skip = 0, int limit = 20);
    Task<IEnumerable<TaskModel>> GetTasksAsync(int skip = 0, int limit = 20, string? status = null, string? projectId = null, string? assignedUserId = null);
    Task<IEnumerable<TagModel>> GetTagsAsync(int skip = 0, int limit = 20);
    Task<IEnumerable<CommentModel>> GetCommentsAsync(int skip = 0, int limit = 20);
}

public class WorkDomainService : IWorkDomainService
{
    private readonly ICustomerRepository _customerRepo;
    private readonly IProjectRepository _projectRepo;
    private readonly ITeamRepository _teamRepo;
    private readonly IUserRepository _userRepo;
    private readonly ITaskRepository _taskRepo;
    private readonly ITagRepository _tagRepo;
    private readonly ICommentRepository _commentRepo;

    public WorkDomainService(
        ICustomerRepository customerRepo,
        IProjectRepository projectRepo,
        ITeamRepository teamRepo,
        IUserRepository userRepo,
        ITaskRepository taskRepo,
        ITagRepository tagRepo,
        ICommentRepository commentRepo)
    {
        _customerRepo = customerRepo;
        _projectRepo = projectRepo;
        _teamRepo = teamRepo;
        _userRepo = userRepo;
        _taskRepo = taskRepo;
        _tagRepo = tagRepo;
        _commentRepo = commentRepo;
    }

    public async Task<IEnumerable<CustomerModel>> GetCustomersAsync(int skip = 0, int limit = 20)
        => await _customerRepo.GetAllAsync(skip, limit).ConfigureAwait(false);

    public async Task<IEnumerable<ProjectModel>> GetProjectsAsync(int skip = 0, int limit = 20)
        => await _projectRepo.GetAllAsync(skip, limit).ConfigureAwait(false);

    public async Task<IEnumerable<TeamModel>> GetTeamsAsync(int skip = 0, int limit = 20)
        => await _teamRepo.GetAllAsync(skip, limit).ConfigureAwait(false);

    public async Task<IEnumerable<UserModel>> GetUsersAsync(int skip = 0, int limit = 20)
        => await _userRepo.GetAllAsync(skip, limit).ConfigureAwait(false);

    public async Task<IEnumerable<TaskModel>> GetTasksAsync(int skip = 0, int limit = 20, string? status = null, string? projectId = null, string? assignedUserId = null)
    {
        if (projectId != null) return await _taskRepo.GetByProjectIdAsync(projectId, skip, limit).ConfigureAwait(false);
        if (status != null) return await _taskRepo.GetByStatusAsync(status, skip, limit).ConfigureAwait(false);
        if (assignedUserId != null) return await _taskRepo.GetByAssignedUserIdAsync(assignedUserId, skip, limit).ConfigureAwait(false);
        return await _taskRepo.GetAllAsync(skip, limit).ConfigureAwait(false);
    }

    public async Task<IEnumerable<TagModel>> GetTagsAsync(int skip = 0, int limit = 20)
        => await _tagRepo.GetAllAsync(skip, limit).ConfigureAwait(false);

    public async Task<IEnumerable<CommentModel>> GetCommentsAsync(int skip = 0, int limit = 20)
        => await _commentRepo.GetAllAsync(skip, limit).ConfigureAwait(false);
}
