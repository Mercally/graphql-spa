using HotChocolate.Types;
using WorkApi.GraphQL.Types;

namespace WorkApi.GraphQL.Mutations;

public class MutationType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Description("Work management mutations");

        // Customers
        descriptor.Field("createCustomer")
            .Type<CustomerType>()
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("email", a => a.Type<NonNullType<StringType>>())
            .ResolveWith<MutationResolvers>(r => r.CreateCustomer(default!, default!, default!));

        descriptor.Field("updateCustomer")
            .Type<CustomerType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("email", a => a.Type<NonNullType<StringType>>())
            .ResolveWith<MutationResolvers>(r => r.UpdateCustomer(default!, default!, default!, default!));

        descriptor.Field("deleteCustomer")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteCustomer(default!, default!));

        // Projects
        descriptor.Field("createProject")
            .Type<ProjectType>()
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("description", a => a.Type<StringType>())
            .Argument("customerId", a => a.Type<NonNullType<IdType>>())
            .Argument("status", a => a.Type<StringType>().DefaultValue("active"))
            .ResolveWith<MutationResolvers>(r => r.CreateProject(default!, default!, default, default!, default));

        descriptor.Field("updateProject")
            .Type<ProjectType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("description", a => a.Type<StringType>())
            .Argument("status", a => a.Type<StringType>())
            .ResolveWith<MutationResolvers>(r => r.UpdateProject(default!, default!, default!, default, default));

        descriptor.Field("deleteProject")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteProject(default!, default!));

        // Teams
        descriptor.Field("createTeam")
            .Type<TeamType>()
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("projectId", a => a.Type<NonNullType<IdType>>())
            .Argument("memberUserIds", a => a.Type<ListType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.CreateTeam(default!, default!, default!, default));

        descriptor.Field("updateTeam")
            .Type<TeamType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("memberUserIds", a => a.Type<ListType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.UpdateTeam(default!, default!, default!, default));

        descriptor.Field("deleteTeam")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteTeam(default!, default!));

        // Users
        descriptor.Field("createUser")
            .Type<UserType>()
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("email", a => a.Type<NonNullType<StringType>>())
            .Argument("role", a => a.Type<NonNullType<StringType>>())
            .ResolveWith<MutationResolvers>(r => r.CreateUser(default!, default!, default!, default!, default!));

        descriptor.Field("updateUser")
            .Type<UserType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("email", a => a.Type<NonNullType<StringType>>())
            .Argument("role", a => a.Type<NonNullType<StringType>>())
            .ResolveWith<MutationResolvers>(r => r.UpdateUser(default!, default!, default!, default!, default!));

        descriptor.Field("deleteUser")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteUser(default!, default!));

        // Tasks
        descriptor.Field("createTask")
            .Type<TaskType>()
            .Argument("title", a => a.Type<NonNullType<StringType>>())
            .Argument("description", a => a.Type<StringType>())
            .Argument("projectId", a => a.Type<NonNullType<IdType>>())
            .Argument("status", a => a.Type<StringType>().DefaultValue("pending"))
            .Argument("assignedUserId", a => a.Type<IdType>())
            .Argument("tagIds", a => a.Type<ListType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.CreateTask(default!, default!, default!, default, default!, default, default, default));

        descriptor.Field("updateTask")
            .Type<TaskType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("title", a => a.Type<NonNullType<StringType>>())
            .Argument("description", a => a.Type<StringType>())
            .Argument("status", a => a.Type<StringType>())
            .Argument("assignedUserId", a => a.Type<IdType>())
            .Argument("tagIds", a => a.Type<ListType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.UpdateTask(default!, default!, default!, default!, default, default, default, default));

        descriptor.Field("deleteTask")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteTask(default!, default!));

        // Tags
        descriptor.Field("createTag")
            .Type<TagType>()
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("color", a => a.Type<StringType>())
            .ResolveWith<MutationResolvers>(r => r.CreateTag(default!, default!, default));

        descriptor.Field("updateTag")
            .Type<TagType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("name", a => a.Type<NonNullType<StringType>>())
            .Argument("color", a => a.Type<StringType>())
            .ResolveWith<MutationResolvers>(r => r.UpdateTag(default!, default!, default!, default));

        descriptor.Field("deleteTag")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteTag(default!, default!));

        // Comments
        descriptor.Field("createComment")
            .Type<CommentType>()
            .Argument("text", a => a.Type<NonNullType<StringType>>())
            .Argument("taskId", a => a.Type<NonNullType<IdType>>())
            .Argument("userId", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.CreateComment(default!, default!, default!, default!));

        descriptor.Field("updateComment")
            .Type<CommentType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .Argument("text", a => a.Type<NonNullType<StringType>>())
            .ResolveWith<MutationResolvers>(r => r.UpdateComment(default!, default!, default!));

        descriptor.Field("deleteComment")
            .Type<BooleanType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<MutationResolvers>(r => r.DeleteComment(default!, default!));
    }
}
