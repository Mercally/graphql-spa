using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;

namespace WorkMvc.Controllers;

public class ProjectController : BaseController
{
    private readonly IDataClientFactory _clients;

    public ProjectController(IDataClientFactory clients, IBackendContext backendContext, IRequestCounter counter)
        : base(backendContext, counter) => _clients = clients;

    // GET /Project/Details/{id}
    public async Task<IActionResult> Details(string id)
    {
        var client = _clients.Resolve<IProjectDataClient>();
        var project = await client.GetByIdAsync(id);
        SetModeViewBag();
        if (project == null) return NotFound();
        return View(project);
    }
}
