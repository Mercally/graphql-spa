using HotChocolate.Resolvers;
using HotChocolate.Types;
using WorkApi.Models;
using WorkApi.Repositories;

namespace WorkApi.GraphQL.Types;

public class CustomerType : ObjectType<CustomerModel>
{
    protected override void Configure(IObjectTypeDescriptor<CustomerModel> descriptor)
    {
        descriptor.Description("A customer in the work management system");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Name).Type<StringType>();
        descriptor.Field(t => t.Email).Type<StringType>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();

        // Navigable relation: customer -> projects
        descriptor.Field("projects")
            .Type<ListType<ProjectType>>()
            .Resolve(async (IResolverContext ctx) =>
            {
                var customer = ctx.Parent<CustomerModel>();
                var repo = ctx.Service<IProjectRepository>();
                return await repo.GetByCustomerIdAsync(customer.Id!).ConfigureAwait(false);
            });
    }
}
