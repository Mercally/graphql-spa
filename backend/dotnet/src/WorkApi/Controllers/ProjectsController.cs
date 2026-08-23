using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectRepository _repo;
    private readonly IMapperHelper _mapper;

    public ProjectsController(IProjectRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<ProjectDto>>> Get(int page = 1, int pageSize = 20, string? status = null, string? customerId = null)
    {
        var skip = (page - 1) * pageSize;
        var items = (customerId != null
            ? await _repo.GetByCustomerIdAsync(customerId, skip, pageSize).ConfigureAwait(false)
            : status != null
            ? await _repo.GetByStatusAsync(status, skip, pageSize).ConfigureAwait(false)
            : await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false)).ToList();
        var totalCount = await (customerId != null
            ? _repo.CountAsync(Builders<ProjectModel>.Filter.Eq(p => p.CustomerId, customerId))
            : status != null
            ? _repo.CountAsync(Builders<ProjectModel>.Filter.Eq(p => p.Status, status))
            : _repo.CountAsync()).ConfigureAwait(false);
        return Ok(new PaginatedList<ProjectDto>(
            items.Select(_mapper.MapProjectToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapProjectToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Post([FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapProjectToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> Put(string id, [FromBody] UpdateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Name = dto.Name ?? entity.Name;
        entity.Description = dto.Description ?? entity.Description;
        entity.Status = dto.Status ?? entity.Status;
        entity.UpdatedAt = DateTime.UtcNow;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapProjectToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static ProjectModel MapCreate(CreateProjectDto dto) =>
        new() { Name = dto.Name, Description = dto.Description, CustomerId = dto.CustomerId, Status = dto.Status };
}
