namespace SoeasyWebsite.Server.DTOs.ProfileShare;

public sealed class SharedProfileDto
{
    public int ShareId { get; set; }
    public int ProfileUserId { get; set; }
    public string? ProfileCode { get; set; }
    public string? FullName { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string? Location { get; set; }
    public string? Education { get; set; }
    public string? Profession { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime SentAt { get; set; }
    public bool IsViewed { get; set; }
}
