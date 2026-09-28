namespace SoeasyWebsite.Server.DTOs.Authentication;

public class LoginOtpRecord
{
    public int OtpId { get; set; }
    public int UserId { get; set; }
    public string MobileNumber { get; set; } = string.Empty;
    public string OtpHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int Attempts { get; set; }
    public bool IsUsed { get; set; }
}
