namespace WorkApi.DTOs;

public class CustomerDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCustomerDto
{
    public required string Name { get; set; }
    public required string Email { get; set; }
}

public class UpdateCustomerDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}
