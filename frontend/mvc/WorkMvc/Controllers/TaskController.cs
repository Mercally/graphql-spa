using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;

namespace WorkMvc.Controllers;

public class TaskController : BaseController
{
    private readonly IDataClientFactory _clients;

    public TaskController(IDataClientFactory clients, IBackendContext backendContext, IRequestCounter counter)
        : base(backendContext, counter) => _clients = clients;

    // GET /Task?status=&projectId=&offset=&limit=
    public async Task<IActionResult> Index(string? status, string? projectId, int offset = 0, int limit = 20)
    {
        var client = _clients.Resolve<ITaskDataClient>();
        var tasks = await client.GetListAsync(status, projectId, offset, limit);

        ViewBag.Status = status;
        ViewBag.ProjectId = projectId;
        ViewBag.Offset = offset;
        ViewBag.Limit = limit;
        SetModeViewBag();
        return View(tasks);
    }

    // GET /Task/Details/{id}
    public async Task<IActionResult> Details(string id)
    {
        var client = _clients.Resolve<ITaskDataClient>();
        var task = await client.GetByIdAsync(id);
        SetModeViewBag();
        if (task == null) return NotFound();
        return View(task);
    }
}
