namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminLoginResponseDto
{
    public int AdminId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? MobileNumber { get; set; }

    public bool IsSuperAdmin { get; set; }

    public string Token { get; set; } = string.Empty;
}