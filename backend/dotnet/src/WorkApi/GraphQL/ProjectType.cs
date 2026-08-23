using HotChocolate.Resolvers;
using HotChocolate.Types;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.GraphQL.Types;

public class ProjectType : ObjectType<ProjectModel>
{
    protected override void Configure(IObjectTypeDescriptor<ProjectModel> descriptor)
    {
        descriptor.Description("A project in the work management system");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Name).Type<StringType>();
        descriptor.Field(t => t.Description).Type<StringType>();
        descriptor.Field(t => t.CustomerId).Type<IdType>();
        descriptor.Field(t => t.Status).Type<StringType>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();
        descriptor.Field(t => t.UpdatedAt).Type<DateTimeType>();

        // Navigable relation: project -> tasks
        descriptor.Field("tasks")
            .Type<ListType<TaskType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var project = ctx.Parent<ProjectModel>();
                var repo = ctx.Service<ITaskRepository>();
                return await repo.GetByProjectIdAsync(project.Id!).ConfigureAwait(false);
            });

        // Navigable relation: project -> teams
        descriptor.Field("teams")
            .Type<ListType<TeamType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var project = ctx.Parent<ProjectModel>();
                var repo = ctx.Service<ITeamRepository>();
                return await repo.GetByProjectIdAsync(project.Id!).ConfigureAwait(false);
            });
    }
}
