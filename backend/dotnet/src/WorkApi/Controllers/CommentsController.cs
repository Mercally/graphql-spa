using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentRepository _repo;
    private readonly IMapperHelper _mapper;

    public CommentsController(ICommentRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<CommentDto>>> Get(int page = 1, int pageSize = 20, string? taskId = null, string? userId = null)
    {
        var skip = (page - 1) * pageSize;
        var items = (taskId != null
            ? await _repo.GetByTaskIdAsync(taskId, skip, pageSize).ConfigureAwait(false)
            : userId != null
            ? await _repo.GetByUserIdAsync(userId, skip, pageSize).ConfigureAwait(false)
            : await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false)).ToList();
        var totalCount = await (taskId != null
            ? _repo.CountAsync(Builders<CommentModel>.Filter.Eq(c => c.TaskId, taskId))
            : userId != null
            ? _repo.CountAsync(Builders<CommentModel>.Filter.Eq(c => c.UserId, userId))
            : _repo.CountAsync()).ConfigureAwait(false);
        return Ok(new PaginatedList<CommentDto>(items.Select(_mapper.MapCommentToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CommentDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapCommentToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> Post([FromBody] CreateCommentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapCommentToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CommentDto>> Put(string id, [FromBody] UpdateCommentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Text = dto.Text ?? entity.Text;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapCommentToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static CommentModel MapCreate(CreateCommentDto dto) =>
        new() { Text = dto.Text, TaskId = dto.TaskId, UserId = dto.UserId };
}
