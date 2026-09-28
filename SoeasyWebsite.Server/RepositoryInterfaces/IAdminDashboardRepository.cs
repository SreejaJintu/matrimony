using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminDashboardRepository
{
    Task<AdminDashboardStatsDto> GetDashboardStats();
}
