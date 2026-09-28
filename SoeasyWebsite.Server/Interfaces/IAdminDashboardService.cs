using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminDashboardService
{
    Task<AdminDashboardStatsDto> GetDashboardStats();
}
