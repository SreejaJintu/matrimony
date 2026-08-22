using SoeasyWebsite.Server.DTOs.Subscription;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface ISubscriptionRepository
{
    Task<SubmitPaymentResultDto> SubmitPayment(SubmitPaymentRequestDto dto);
    Task<bool> ApproveSubscription(int subscriptionId, int adminUserId);
    Task<SubscriptionStatusDto?> GetStatus(int userId);
    Task<ProfileUnlockResultDto> UnlockProfile(int viewerUserId, int targetUserId);
    Task<MarriedRefundResultDto> MarkProfileAsMarried(int marriedUserId, int adminUserId);

    /// <summary>
    /// Calls sp_CheckAndDeductProfileView. Deducts one credit and records the unlock
    /// if the viewer has an active approved subscription with remaining views.
    /// </summary>
    Task<ProfileViewCheckResultDto> CheckAndDeductProfileView(int viewerUserId, int targetUserId);
}
