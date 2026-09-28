using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminPlanService : IAdminPlanService
{
    private readonly IAdminPlanRepository _repository;

    public AdminPlanService(IAdminPlanRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<IEnumerable<PlanResponseDto>>> GetAllPlansAsync()
    {
        var plans = await _repository.GetAllPlansAsync();
        return new ApiResponse<IEnumerable<PlanResponseDto>>
        {
            Success = true,
            Message = "Plans retrieved successfully.",
            Data = plans
        };
    }

    public async Task<ApiResponse<bool>> CreatePlanAsync(CreatePlanRequestDto dto)
    {
        var id = await _repository.CreatePlanAsync(dto);
        return new ApiResponse<bool>
        {
            Success = id > 0,
            Message = id > 0 ? "Membership plan created successfully." : "Failed to create plan.",
            Data = id > 0
        };
    }

    public async Task<ApiResponse<bool>> UpdatePlanAsync(int planId, CreatePlanRequestDto dto)
    {
        var updated = await _repository.UpdatePlanAsync(planId, dto);
        return new ApiResponse<bool>
        {
            Success = updated,
            Message = updated ? "Membership plan updated successfully." : "Plan not found.",
            Data = updated
        };
    }

    public async Task<bool> DeactivatePlanAsync(int planId)
    {
        return await _repository.DeactivatePlanAsync(planId);
    }
}