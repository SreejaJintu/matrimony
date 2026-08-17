namespace SoeasyWebsite.Server.DTOs.Subscription;

public class ProfileUnlockResultDto
{
    public bool CanView { get; set; }
    public bool IsOwnProfile { get; set; }
    public bool CreditDeducted { get; set; }
    public int RemainingCredits { get; set; }
    public string Message { get; set; } = string.Empty;
}
