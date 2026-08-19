namespace SoeasyWebsite.Server.Models;

public class AdminUserLoginModel
{
    public int AdminId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? MobileNumber { get; set; }

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsSuperAdmin { get; set; }

    public bool IsActive { get; set; }

    public DateTime? LastLogin { get; set; }
}