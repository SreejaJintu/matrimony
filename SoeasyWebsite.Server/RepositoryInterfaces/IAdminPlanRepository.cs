using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminPlanRepository
{
    Task<IEnumerable<PlanResponseDto>> GetAllPlansAsync();
    Task<int> CreatePlanAsync(CreatePlanRequestDto dto);
}