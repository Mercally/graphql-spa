using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;

namespace WorkMvc.Controllers;

public class UserController : BaseController
{
    private readonly IDataClientFactory _clients;

    public UserController(IDataClientFactory clients, IBackendContext backendContext, IRequestCounter counter)
        : base(backendContext, counter) => _clients = clients;

    // GET /User/Details/{id}
    public async Task<IActionResult> Details(string id)
    {
        var client = _clients.Resolve<IUserDataClient>();
        var user = await client.GetByIdAsync(id);
        SetModeViewBag();
        if (user == null) return NotFound();
        return View(user);
    }
}
