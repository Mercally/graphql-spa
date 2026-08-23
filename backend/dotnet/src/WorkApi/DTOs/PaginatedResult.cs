namespace WorkApi.DTOs;

public class PaginatedResult<T>
{
    public List<T> Data { get; set; } = new();
    public int Total { get; set; }
    public int Offset { get; set; }
    public int Limit { get; set; }
}
