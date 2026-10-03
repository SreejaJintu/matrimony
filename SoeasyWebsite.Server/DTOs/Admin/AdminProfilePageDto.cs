namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminProfilePageDto
{
    public IEnumerable<AdminProfileDto> Items { get; set; } = Array.Empty<AdminProfileDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
