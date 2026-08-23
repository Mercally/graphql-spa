using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamRepository _repo;
    private readonly IMapperHelper _mapper;

    public TeamsController(ITeamRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<TeamDto>>> Get(int page = 1, int pageSize = 20, string? projectId = null)
    {
        var skip = (page - 1) * pageSize;
        var items = (projectId != null
            ? await _repo.GetByProjectIdAsync(projectId, skip, pageSize).ConfigureAwait(false)
            : await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false)).ToList();
        var totalCount = await (projectId != null
            ? _repo.CountAsync(Builders<TeamModel>.Filter.Eq(t => t.ProjectId, projectId))
            : _repo.CountAsync()).ConfigureAwait(false);
        return Ok(new PaginatedList<TeamDto>(
            items.Select(_mapper.MapTeamToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapTeamToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> Post([FromBody] CreateTeamDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapTeamToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TeamDto>> Put(string id, [FromBody] UpdateTeamDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Name = dto.Name ?? entity.Name;
        entity.MemberUserIds = dto.MemberUserIds?.Cast<string?>().ToList() ?? entity.MemberUserIds;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapTeamToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static TeamModel MapCreate(CreateTeamDto dto) =>
        new() { Name = dto.Name, ProjectId = dto.ProjectId, MemberUserIds = dto.MemberUserIds.Cast<string?>().ToList() };
}
