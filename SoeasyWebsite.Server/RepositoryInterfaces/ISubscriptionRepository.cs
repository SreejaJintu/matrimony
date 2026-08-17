using SoeasyWebsite.Server.DTOs.Subscription;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface ISubscriptionRepository
{
    Task<SubmitPaymentResultDto> SubmitPayment(SubmitPaymentRequestDto dto);
    Task<bool> ApproveSubscription(int subscriptionId, int adminUserId);
    Task<SubscriptionStatusDto?> GetStatus(int userId);
    Task<ProfileUnlockResultDto> UnlockProfile(int viewerUserId, int targetUserId);
    Task<MarriedRefundResultDto> MarkProfileAsMarried(int marriedUserId, int adminUserId);
}
