using WorkMvc.Models.View;

namespace WorkMvc.Services.Clients;

// One interface per entity, each with a Rest*Client and a GraphQl*Client implementation
// (Requirements.md section 12 point 6). The active implementation is chosen per-request by
// DataClientFactory based on IBackendContext.Mode, using .NET 8 keyed DI - see Program.cs.

public interface ICustomerDataClient
{
    Task<List<CustomerListItemVm>> GetAllAsync();
    Task<CustomerDetailVm?> GetByIdAsync(string id);
}

public interface IProjectDataClient
{
    Task<ProjectDetailVm?> GetByIdAsync(string id);
}

public interface ITaskDataClient
{
    Task<List<TaskListItemVm>> GetListAsync(string? status, string? projectId, int offset, int limit);
    Task<TaskDetailVm?> GetByIdAsync(string id);
}

public interface ITeamDataClient
{
    Task<TeamDetailVm?> GetByIdAsync(string id);
}

public interface IUserDataClient
{
    Task<UserVm?> GetByIdAsync(string id);
}
