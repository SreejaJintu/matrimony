using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Subscription;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _subscriptionRepository;

    public SubscriptionService(ISubscriptionRepository subscriptionRepository)
    {
        _subscriptionRepository = subscriptionRepository;
    }

    public async Task<ApiResponse<SubmitPaymentResultDto>> SubmitPayment(SubmitPaymentRequestDto dto)
    {
        var result = await _subscriptionRepository.SubmitPayment(dto);

        return new ApiResponse<SubmitPaymentResultDto>
        {
            Success = result.SubscriptionId > 0,
            Message = result.SubscriptionId > 0
                ? "Payment submitted successfully. Awaiting admin approval."
                : result.Message,
            Data = result
        };
    }

    public async Task<ApiResponse<bool>> ApproveSubscription(int subscriptionId, int adminUserId)
    {
        var result = await _subscriptionRepository.ApproveSubscription(subscriptionId, adminUserId);

        return new ApiResponse<bool>
        {
            Success = result,
            Message = result ? "Subscription approved successfully." : "Failed to approve subscription.",
            Data = result
        };
    }

    public async Task<ApiResponse<SubscriptionStatusDto>> GetStatus(int userId)
    {
        var result = await _subscriptionRepository.GetStatus(userId);

        if (result == null)
        {
            return new ApiResponse<SubscriptionStatusDto>
            {
                Success = false,
                Message = "No active subscription found.",
                Data = null
            };
        }

        return new ApiResponse<SubscriptionStatusDto>
        {
            Success = true,
            Message = "Subscription status retrieved successfully.",
            Data = result
        };
    }

    public async Task<ApiResponse<ProfileUnlockResultDto>> UnlockProfile(int viewerUserId, int targetUserId)
    {
        var result = await _subscriptionRepository.UnlockProfile(viewerUserId, targetUserId);

        return new ApiResponse<ProfileUnlockResultDto>
        {
            Success = true,
            Message = result.Message,
            Data = result
        };
    }

    public async Task<ApiResponse<MarriedRefundResultDto>> MarkProfileAsMarried(int marriedUserId, int adminUserId)
    {
        var result = await _subscriptionRepository.MarkProfileAsMarried(marriedUserId, adminUserId);

        return new ApiResponse<MarriedRefundResultDto>
        {
            Success = result.Success,
            Message = result.Message,
            Data = result
        };
    }
}
