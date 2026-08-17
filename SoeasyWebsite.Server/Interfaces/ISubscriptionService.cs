using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Subscription;

namespace SoeasyWebsite.Server.Interfaces;

public interface ISubscriptionService
{
    Task<ApiResponse<SubmitPaymentResultDto>> SubmitPayment(SubmitPaymentRequestDto dto);
    Task<ApiResponse<bool>> ApproveSubscription(int subscriptionId, int adminUserId);
    Task<ApiResponse<SubscriptionStatusDto>> GetStatus(int userId);
    Task<ApiResponse<ProfileUnlockResultDto>> UnlockProfile(int viewerUserId, int targetUserId);
    Task<ApiResponse<MarriedRefundResultDto>> MarkProfileAsMarried(int marriedUserId, int adminUserId);
}
