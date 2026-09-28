using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminPlanService
{
    Task<ApiResponse<IEnumerable<PlanResponseDto>>> GetAllPlansAsync();
    Task<ApiResponse<bool>> CreatePlanAsync(CreatePlanRequestDto dto);
    Task<ApiResponse<bool>> UpdatePlanAsync(int planId, CreatePlanRequestDto dto);
    Task<bool> DeactivatePlanAsync(int planId);
}