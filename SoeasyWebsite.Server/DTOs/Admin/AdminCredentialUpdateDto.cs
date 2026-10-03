namespace SoeasyWebsite.Server.DTOs.Admin;

public sealed class AdminCredentialUpdateDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? NewPassword { get; set; }
}

public sealed class AdminPasswordResetDto
{
    public string NewPassword { get; set; } = string.Empty;
}
