using HotChocolate.Types;
using WorkApi.Models;

namespace WorkApi.GraphQL.Types;

public class UserType : ObjectType<UserModel>
{
    protected override void Configure(IObjectTypeDescriptor<UserModel> descriptor)
    {
        descriptor.Description("A user in the work management system");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Name).Type<StringType>();
        descriptor.Field(t => t.Email).Type<StringType>();
        descriptor.Field(t => t.Role).Type<StringType>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();
    }
}
