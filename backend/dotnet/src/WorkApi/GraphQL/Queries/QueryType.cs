using HotChocolate.Types;
using WorkApi.GraphQL.Types;

namespace WorkApi.GraphQL.Queries;

// Pagination note: both GraphQL and REST use the same simple offset/limit style
// (REST exposes it as page/pageSize and converts to skip/limit internally) rather than
// cursor-based (Relay) pagination, since this is a PoC comparing REST vs GraphQL shapes
// and a consistent, simple paging story makes that comparison easier to read.
public class QueryType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Description("Work management queries");

        descriptor.Field("customers")
            .Type<ListType<CustomerType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .ResolveWith<QueryResolvers>(r => r.GetCustomers(default!, default, default));

        descriptor.Field("customer")
            .Type<CustomerType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetCustomerById(default!, default!));

        descriptor.Field("projects")
            .Type<ListType<ProjectType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .Argument("status", a => a.Type<StringType>())
            .Argument("customerId", a => a.Type<IdType>())
            .ResolveWith<QueryResolvers>(r => r.GetProjects(default!, default, default, default, default));

        descriptor.Field("project")
            .Type<ProjectType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetProjectById(default!, default!));

        descriptor.Field("tasks")
            .Type<ListType<TaskType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .Argument("status", a => a.Type<StringType>())
            .Argument("projectId", a => a.Type<IdType>())
            .Argument("assignedUserId", a => a.Type<IdType>())
            .ResolveWith<QueryResolvers>(r => r.GetTasks(default!, default, default, default, default, default));

        descriptor.Field("task")
            .Type<TaskType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetTaskById(default!, default!));

        descriptor.Field("teams")
            .Type<ListType<TeamType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .Argument("projectId", a => a.Type<IdType>())
            .ResolveWith<QueryResolvers>(r => r.GetTeams(default!, default, default, default));

        descriptor.Field("team")
            .Type<TeamType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetTeamById(default!, default!));

        descriptor.Field("users")
            .Type<ListType<UserType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .ResolveWith<QueryResolvers>(r => r.GetUsers(default!, default, default));

        descriptor.Field("user")
            .Type<UserType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetUserById(default!, default!));

        descriptor.Field("tags")
            .Type<ListType<TagType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .ResolveWith<QueryResolvers>(r => r.GetTags(default!, default, default));

        descriptor.Field("tag")
            .Type<TagType>()
            .Argument("id", a => a.Type<NonNullType<IdType>>())
            .ResolveWith<QueryResolvers>(r => r.GetTagById(default!, default!));

        descriptor.Field("comments")
            .Type<ListType<CommentType>>()
            .Argument("offset", a => a.Type<IntType>().DefaultValue(0))
            .Argument("limit", a => a.Type<IntType>().DefaultValue(20))
            .Argument("taskId", a => a.Type<IdType>())
            .Argument("userId", a => a.Type<IdType>())
            .ResolveWith<QueryResolvers>(r => r.GetComments(default!, default, default, default, default));
    }
}
