using WorkMvc.Services.Backend;

namespace WorkMvc.Services.Clients;

/// <summary>
/// Resolves the REST or GraphQL implementation of a given entity client interface based on
/// the current request's IBackendContext.Mode. Both implementations are registered in
/// Program.cs as .NET 8 keyed services (key "rest" / "graphql"); this factory just picks
/// the right key at resolve time so controllers stay oblivious to which transport is active.
/// </summary>
public interface IDataClientFactory
{
    T Resolve<T>() where T : class;
}

public class DataClientFactory : IDataClientFactory
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IBackendContext _backendContext;

    public DataClientFactory(IServiceProvider serviceProvider, IBackendContext backendContext)
    {
        _serviceProvider = serviceProvider;
        _backendContext = backendContext;
    }

    public T Resolve<T>() where T : class
    {
        var key = _backendContext.Mode == ApiMode.Rest ? "rest" : "graphql";
        return _serviceProvider.GetRequiredKeyedService<T>(key);
    }
}
