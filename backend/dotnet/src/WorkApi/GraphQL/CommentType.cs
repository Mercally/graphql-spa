using HotChocolate.Types;
using WorkApi.Models;

namespace WorkApi.GraphQL.Types;

public class CommentType : ObjectType<CommentModel>
{
    protected override void Configure(IObjectTypeDescriptor<CommentModel> descriptor)
    {
        descriptor.Description("A comment on a task");

        descriptor.Field(c => c.Id).Type<IdType>();
        descriptor.Field(c => c.Text).Type<StringType>();
        descriptor.Field(c => c.TaskId).Type<IdType>();
        descriptor.Field(c => c.UserId).Type<IdType>();
        descriptor.Field(c => c.CreatedAt).Type<DateTimeType>();
    }
}
