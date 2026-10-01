namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminBrokerCandidateDto
{
    public int UserId { get; set; }
    public string ProfileCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public byte GenderId { get; set; }
    public string? GenderName { get; set; }
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }
    public byte ProfileStatusId { get; set; }
    public string? StatusName { get; set; }
    public bool IsProfileCompleted { get; set; }
    public bool IsPremium { get; set; }
    public DateTime CreatedAt { get; set; }
}
