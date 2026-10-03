using SoeasyWebsite.Server.Models;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminAuthRepository
{
    Task<AdminUserLoginModel?> Login(string userName);
    Task<AdminUserLoginModel?> GetById(int adminId);
    Task<IReadOnlyList<AdminAccountSummary>> GetActiveAdmins();
    Task<bool> IsActiveSuperAdmin(int adminId);
    Task<int> UpdateCredentials(int adminId, string userName, string? email, string? passwordHash);
    Task<bool> ResetPassword(int adminId, string passwordHash);
}

public sealed class AdminAccountSummary
{
    public int AdminId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? Email { get; set; }
}
