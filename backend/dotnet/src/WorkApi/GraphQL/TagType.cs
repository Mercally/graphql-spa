using HotChocolate.Types;
using WorkApi.Models;

namespace WorkApi.GraphQL.Types;

public class TagType : ObjectType<TagModel>
{
    protected override void Configure(IObjectTypeDescriptor<TagModel> descriptor)
    {
        descriptor.Description("A tag for categorizing tasks");

        descriptor.Field(t => t.Id).Type<IdType>();
        descriptor.Field(t => t.Name).Type<StringType>();
        descriptor.Field(t => t.Color).Type<StringType>();
        descriptor.Field(t => t.CreatedAt).Type<DateTimeType>();
    }
}
