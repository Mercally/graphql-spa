using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;
using WorkMvc.Services.Clients;

namespace WorkMvc.Controllers;

public class CustomerController : BaseController
{
    private readonly IDataClientFactory _clients;

    public CustomerController(IDataClientFactory clients, IBackendContext backendContext, IRequestCounter counter)
        : base(backendContext, counter) => _clients = clients;

    // GET /Customer
    public async Task<IActionResult> Index()
    {
        var client = _clients.Resolve<ICustomerDataClient>();
        var customers = await client.GetAllAsync();
        SetModeViewBag();
        return View(customers);
    }

    // GET /Customer/Details/{id}
    public async Task<IActionResult> Details(string id)
    {
        var client = _clients.Resolve<ICustomerDataClient>();
        var customer = await client.GetByIdAsync(id);
        SetModeViewBag();
        if (customer == null) return NotFound();
        return View(customer);
    }
}
