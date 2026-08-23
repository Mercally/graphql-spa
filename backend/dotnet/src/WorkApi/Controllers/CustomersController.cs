using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repo;
    private readonly IMapperHelper _mapper;

    public CustomersController(ICustomerRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<CustomerDto>>> Get(int page = 1, int pageSize = 20, string? name = null)
    {
        var skip = (page - 1) * pageSize;
        var (items, totalCount) = await GetWithCountAsync(skip, pageSize, name).ConfigureAwait(false);
        return Ok(new PaginatedList<CustomerDto>(
            items.Select(_mapper.MapCustomerToDto).ToList(),
            (int)totalCount, page, pageSize));
    }

    private async Task<(List<CustomerModel> items, long totalCount)> GetWithCountAsync(int skip, int pageSize, string? name)
    {
        if (name != null)
        {
            var filtered = await _repo.GetByNameAsync(name, skip, pageSize).ConfigureAwait(false);
            var filteredCount = await _repo.CountAsync(Builders<CustomerModel>.Filter.Regex(
                c => c.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"))).ConfigureAwait(false);
            return (filtered, filteredCount);
        }

        var items = await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false);
        var totalCount = await _repo.CountAsync().ConfigureAwait(false);
        return (items, totalCount);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapCustomerToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Post([FromBody] CreateCustomerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapCustomerToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CustomerDto>> Put(string id, [FromBody] UpdateCustomerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Name = dto.Name ?? entity.Name;
        entity.Email = dto.Email ?? entity.Email;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapCustomerToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static CustomerModel MapCreate(CreateCustomerDto dto) =>
        new() { Name = dto.Name, Email = dto.Email };
}
