namespace SoeasyWebsite.Server.DTOs.Subscription;

/// <summary>
/// Result returned by sp_CheckAndDeductProfileView via OUTPUT parameters.
/// </summary>
public class ProfileViewCheckResultDto
{
    public bool CanView { get; set; }
    public string Message { get; set; } = string.Empty;
}
