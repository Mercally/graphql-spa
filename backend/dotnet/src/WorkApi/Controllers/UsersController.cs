using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WorkApi.DTOs;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IMapperHelper _mapper;

    public UsersController(IUserRepository repo, IMapperHelper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<UserDto>>> Get(int page = 1, int pageSize = 20, string? role = null)
    {
        var skip = (page - 1) * pageSize;
        var items = (role != null
            ? await _repo.GetByRoleAsync(role, skip, pageSize).ConfigureAwait(false)
            : await _repo.GetAllAsync(skip, pageSize).ConfigureAwait(false)).ToList();
        var totalCount = await (role != null
            ? _repo.CountAsync(Builders<UserModel>.Filter.Eq(u => u.Role, role))
            : _repo.CountAsync()).ConfigureAwait(false);
        return Ok(new PaginatedList<UserDto>(items.Select(_mapper.MapUserToDto).ToList(), (int)totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> Get(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        return Ok(_mapper.MapUserToDto(entity));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Post([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = MapCreate(dto);
        var created = await _repo.InsertAsync(entity).ConfigureAwait(false);
        return CreatedAtAction("Get", new { id = created.Id }, _mapper.MapUserToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Put(string id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        entity.Name = dto.Name ?? entity.Name;
        entity.Email = dto.Email ?? entity.Email;
        entity.Role = dto.Role ?? entity.Role;
        var updated = await _repo.UpdateAsync(id, entity).ConfigureAwait(false);
        if (updated == null) return NotFound();
        return Ok(_mapper.MapUserToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entity = await _repo.GetByIdAsync(id).ConfigureAwait(false);
        if (entity == null) return NotFound();
        await _repo.DeleteAsync(id).ConfigureAwait(false);
        return NoContent();
    }

    private static UserModel MapCreate(CreateUserDto dto) =>
        new() { Name = dto.Name, Email = dto.Email, Role = dto.Role };
}
