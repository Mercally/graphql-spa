using WorkApi;
using WorkApi.Models;
using Xunit;

namespace WorkApi.Tests;

public class MapperHelperTests
{
    private readonly MapperHelper _mapper = new();

    [Fact]
    public void MapCustomerToDto_CopiesAllFields()
    {
        var model = new CustomerModel
        {
            Id = "507f1f77bcf86cd799439011",
            Name = "Acme Corp",
            Email = "contact@acme.test",
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var dto = _mapper.MapCustomerToDto(model);

        Assert.Equal(model.Id, dto.Id);
        Assert.Equal(model.Name, dto.Name);
        Assert.Equal(model.Email, dto.Email);
        Assert.Equal(model.CreatedAt, dto.CreatedAt);
    }

    [Fact]
    public void MapTaskToDto_FiltersNullTagIdsAndDefaultsMissingProjectId()
    {
        var model = new TaskModel
        {
            Id = "507f1f77bcf86cd799439012",
            Title = "Write tests",
            Description = "Cover the mapper",
            ProjectId = null,
            Status = "pending",
            AssignedUserId = null,
            TagIds = new List<string?> { "tag-1", null, "tag-2" }
        };

        var dto = _mapper.MapTaskToDto(model);

        Assert.Equal(string.Empty, dto.ProjectId);
        Assert.Equal(new List<string> { "tag-1", "tag-2" }, dto.TagIds);
        Assert.Null(dto.AssignedUserId);
    }
}
