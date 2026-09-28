namespace SoeasyWebsite.Server.DTOs.Admin;

public class BrokerDto
{
    public int BrokerId { get; set; }
    public int UserId { get; set; }
    public string BrokerName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public bool IsActive { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string ProfileCode { get; set; } = string.Empty;
    public string? UserMobileNumber { get; set; }
    public string? UserEmail { get; set; }
}