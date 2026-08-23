using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;

namespace WorkMvc.Controllers;

public class TeamController : BaseController
{
    private readonly IDataClientFactory _clients;

    public TeamController(IDataClientFactory clients, IBackendContext backendContext, IRequestCounter counter)
        : base(backendContext, counter) => _clients = clients;

    // GET /Team/Details/{id}
    public async Task<IActionResult> Details(string id)
    {
        var client = _clients.Resolve<ITeamDataClient>();
        var team = await client.GetByIdAsync(id);
        SetModeViewBag();
        if (team == null) return NotFound();
        return View(team);
    }
}
