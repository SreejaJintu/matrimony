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
}