using Microsoft.AspNetCore.Mvc;
using WorkMvc.Services.Backend;

namespace WorkMvc.Controllers;

/// <summary>
/// Every controller calls SetModeViewBag() after it has finished fetching data for the page,
/// so the layout's mode-indicator banner can show which paradigm/backend served the page and
/// how many outbound HTTP calls it took (Requirements.md section 12 point 5).
/// </summary>
public abstract class BaseController : Controller
{
    protected readonly IBackendContext BackendContext;
    protected readonly IRequestCounter Counter;

    protected BaseController(IBackendContext backendContext, IRequestCounter counter)
    {
        BackendContext = backendContext;
        Counter = counter;
    }

    protected void SetModeViewBag()
    {
        ViewBag.Mode = BackendContext.Mode.ToString();
        ViewBag.Backend = BackendContext.Backend.ToString();
        ViewBag.CallCount = Counter.Count;
        ViewBag.Calls = Counter.Calls;
    }
}
