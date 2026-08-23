namespace WorkApi.DTOs;

public record PaginatedList<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);
