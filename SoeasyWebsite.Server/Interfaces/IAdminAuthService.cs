using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminAuthService
{
    Task<AdminLoginResponseDto?> Login(
        AdminLoginRequestDto dto);
    Task<(bool Success, string Message)> UpdateCredentials(int adminId, string currentPassword, string userName, string? email, string? newPassword);
    Task<IReadOnlyList<AdminAccountSummary>?> GetActiveAdminsForSuperAdmin(int actorAdminId);
    Task<bool> ResetAdminPassword(int actorAdminId, int targetAdminId, string newPassword);
}
