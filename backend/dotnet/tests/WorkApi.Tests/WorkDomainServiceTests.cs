using WorkApi.Models;
using WorkApi.Repositories;
using WorkApi.Services;
using WorkApi.Tests.Fakes;
using Xunit;

namespace WorkApi.Tests;

public class WorkDomainServiceTests
{
    private static WorkDomainService CreateService(FakeTaskRepository taskRepo) =>
        new(
            customerRepo: null!,
            projectRepo: null!,
            teamRepo: null!,
            userRepo: null!,
            taskRepo: taskRepo,
            tagRepo: null!,
            commentRepo: null!);

    [Fact]
    public async Task GetTasksAsync_WithProjectId_DelegatesToGetByProjectId()
    {
        var taskRepo = new FakeTaskRepository();
        taskRepo.Items.Add(new TaskModel { Id = "1", Title = "A", Description = "", ProjectId = "p1", Status = "pending" });
        taskRepo.Items.Add(new TaskModel { Id = "2", Title = "B", Description = "", ProjectId = "p2", Status = "pending" });
        var service = CreateService(taskRepo);

        var result = (await service.GetTasksAsync(projectId: "p1")).ToList();

        Assert.Single(result);
        Assert.Equal("1", result[0].Id);
    }

    [Fact]
    public async Task GetTasksAsync_WithStatus_DelegatesToGetByStatus()
    {
        var taskRepo = new FakeTaskRepository();
        taskRepo.Items.Add(new TaskModel { Id = "1", Title = "A", Description = "", ProjectId = "p1", Status = "done" });
        taskRepo.Items.Add(new TaskModel { Id = "2", Title = "B", Description = "", ProjectId = "p1", Status = "pending" });
        var service = CreateService(taskRepo);

        var result = (await service.GetTasksAsync(status: "done")).ToList();

        Assert.Single(result);
        Assert.Equal("done", result[0].Status);
    }

    [Fact]
    public async Task GetTasksAsync_NoFilters_ReturnsAll()
    {
        var taskRepo = new FakeTaskRepository();
        taskRepo.Items.Add(new TaskModel { Id = "1", Title = "A", Description = "", ProjectId = "p1", Status = "pending" });
        taskRepo.Items.Add(new TaskModel { Id = "2", Title = "B", Description = "", ProjectId = "p1", Status = "done" });
        var service = CreateService(taskRepo);

        var result = (await service.GetTasksAsync()).ToList();

        Assert.Equal(2, result.Count);
    }
}
