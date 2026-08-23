using Microsoft.AspNetCore.Mvc;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly ITagRepository _repo;
    private readonly IMapperHelper _mapper;

    public TagsController(ITagRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<TagDto>>> Get(int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var items = (await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false)).ToList();
        var totalCount = await _repo.CountAsync().ConfigureAwait(false);
        return Ok(new PaginatedList<TagDto>(items.Select(_mapper.MapTagToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TagDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapTagToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<TagDto>> Post([FromBody] CreateTagDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapTagToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TagDto>> Put(string id, [FromBody] UpdateTagDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Name = dto.Name ?? entity.Name;
        if (dto.Color != null) entity.Color = dto.Color;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapTagToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static TagModel MapCreate(CreateTagDto dto) =>
        new() { Name = dto.Name, Color = dto.Color ?? string.Empty };
}
