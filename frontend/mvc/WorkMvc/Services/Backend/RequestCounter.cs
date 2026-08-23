using System.Collections.Concurrent;

namespace WorkMvc.Services.Backend;

/// <summary>
/// Counts outbound HTTP calls made to the backend while rendering a single MVC request.
/// Registered as Scoped so the count resets per request. Both RestGateway and
/// GraphQlGateway call Record(...) for every call they make; controllers read
/// Count/Calls after building their view model and surface it via ViewBag so every
/// page can visibly show "N backend calls" - the concrete, reproducible answer to
/// Requirements.md's "over-fetching / múltiples requests REST vs una query GraphQL" demo.
/// </summary>
public interface IRequestCounter
{
    int Count { get; }
    IReadOnlyList<string> Calls { get; }
    void Record(string description);
}

public class RequestCounter : IRequestCounter
{
    private readonly ConcurrentQueue<string> _calls = new();
    private int _count;

    public int Count => _count;
    public IReadOnlyList<string> Calls => _calls.ToList();

    public void Record(string description)
    {
        Interlocked.Increment(ref _count);
        _calls.Enqueue(description);
    }
}
