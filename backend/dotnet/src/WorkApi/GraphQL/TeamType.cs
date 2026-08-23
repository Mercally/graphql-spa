using HotChocolate.Resolvers;
using HotChocolate.Types;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.GraphQL.Types;

public class TeamType : ObjectType<TeamModel>
{
    protected override void Configure(IObjectTypeDescriptor<TeamModel> descriptor)
    {
        descriptor.Description("A project team");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Name).Type<StringType>();
        descriptor.Field(t => t.ProjectId).Type<IdType>();
        descriptor.Field(t => t.MemberUserIds).Type<ListType<IdType>>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();

        // Navigable relation: team -> users
        descriptor.Field("users")
            .Type<ListType<UserType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var team = ctx.Parent<TeamModel>();
                var repo = ctx.Service<IUserRepository>();
                var ids = (team.MemberUserIds ?? new List<string?>()).Where(id => id != null).Cast<string>();
                return await repo.GetByIdsAsync(ids).ConfigureAwait(false);
            });
    }
}
