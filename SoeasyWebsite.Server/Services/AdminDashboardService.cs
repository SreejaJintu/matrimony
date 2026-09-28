using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly IAdminDashboardRepository _repository;

    public AdminDashboardService(IAdminDashboardRepository repository)
    {
        _repository = repository;
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStats()
    {
        return await _repository.GetDashboardStats();
    }
}
