using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminSubscriptionService : IAdminSubscriptionService
{
    private readonly IAdminSubscriptionRepository _repository;

    public AdminSubscriptionService(
        IAdminSubscriptionRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<AdminActivateSubscriptionResultDto>> ActivateSubscription(
        AdminActivateSubscriptionRequestDto dto,
        int adminUserId)
    {
        var result = await _repository.ActivateSubscription(
            dto,
            adminUserId);

        if (result == null)
        {
            return new ApiResponse<AdminActivateSubscriptionResultDto>
            {
                Success = false,
                Message = "Subscription activation failed.",
                Data = null
            };
        }

        return new ApiResponse<AdminActivateSubscriptionResultDto>
        {
            Success = result.Success,
            Message = result.Message,
            Data = result
        };
    }
}