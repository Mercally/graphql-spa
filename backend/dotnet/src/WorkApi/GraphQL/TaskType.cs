using HotChocolate.Resolvers;
using HotChocolate.Types;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.GraphQL.Types;

public class TaskType : ObjectType<TaskModel>
{
    protected override void Configure(IObjectTypeDescriptor<TaskModel> descriptor)
    {
        descriptor.Description("A task within a project");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Title).Type<StringType>();
        descriptor.Field(t => t.Description).Type<StringType>();
        descriptor.Field(t => t.ProjectId).Type<IdType>();
        descriptor.Field(t => t.Status).Type<StringType>();
        descriptor.Field(t => t.AssignedUserId).Type<IdType>();
        descriptor.Field(t => t.TagIds).Type<ListType<IdType>>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();
        descriptor.Field(t => t.UpdatedAt).Type<DateTimeType>();

        // Navigable relation: task -> assignedUser
        descriptor.Field("assignedUser")
            .Type<UserType>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var task = ctx.Parent<TaskModel>();
                if (string.IsNullOrEmpty(task.AssignedUserId)) return null;
                var repo = ctx.Service<IUserRepository>();
                return await repo.GetByIdAsync(task.AssignedUserId).ConfigureAwait(false);
            });

        // Navigable relation: task -> tags
        descriptor.Field("tags")
            .Type<ListType<TagType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var task = ctx.Parent<TaskModel>();
                var repo = ctx.Service<ITagRepository>();
                var ids = (task.TagIds ?? new List<string?>()).Where(id => id != null).Cast<string>();
                return await repo.GetByIdsAsync(ids).ConfigureAwait(false);
            });

        // Navigable relation: task -> comments
        descriptor.Field("comments")
            .Type<ListType<CommentType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var task = ctx.Parent<TaskModel>();
                var repo = ctx.Service<ICommentRepository>();
                return await repo.GetByTaskIdAsync(task.Id!).ConfigureAwait(false);
            });
    }
}
