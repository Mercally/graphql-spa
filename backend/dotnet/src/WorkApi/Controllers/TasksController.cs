using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;
    private readonly IMapperHelper _mapper;

    public TasksController(ITaskRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<TaskDto>>> Get(int page = 1, int pageSize = 20, string? status = null, string? projectId = null, string? assignedUserId = null)
    {
        var skip = (page - 1) * pageSize;

        var items = projectId != null
            ? await _repo.GetByProjectIdAsync(projectId, skip, pageSize).ConfigureAwait(false)
            : status != null
            ? await _repo.GetByStatusAsync(status, skip, pageSize).ConfigureAwait(false)
            : assignedUserId != null
            ? await _repo.GetByAssignedUserIdAsync(assignedUserId, skip, pageSize).ConfigureAwait(false)
            : await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false);
        items = items.ToList();

        var totalCount = await (projectId != null
            ? _repo.CountAsync(Builders<TaskModel>.Filter.Eq(t => t.ProjectId, projectId))
            : status != null
            ? _repo.CountAsync(Builders<TaskModel>.Filter.Eq(t => t.Status, status))
            : assignedUserId != null
            ? _repo.CountAsync(Builders<TaskModel>.Filter.Eq(t => t.AssignedUserId, assignedUserId))
            : _repo.CountAsync()).ConfigureAwait(false);

        return Ok(new PaginatedList<TaskDto>(items.Select(_mapper.MapTaskToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapTaskToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> Post([FromBody] CreateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapTaskToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> Put(string id, [FromBody] UpdateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Title = dto.Title ?? entity.Title;
        entity.Description = dto.Description ?? entity.Description;
        entity.Status = dto.Status ?? entity.Status;
        entity.AssignedUserId = dto.AssignedUserId ?? entity.AssignedUserId;
        entity.TagIds = dto.TagIds?.Cast<string?>().ToList() ?? entity.TagIds;
        entity.UpdatedAt = DateTime.UtcNow;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapTaskToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static TaskModel MapCreate(CreateTaskDto dto) =>
        new()
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            Status = dto.Status,
            AssignedUserId = dto.AssignedUserId,
            TagIds = dto.TagIds.Cast<string?>().ToList()
        };
}
