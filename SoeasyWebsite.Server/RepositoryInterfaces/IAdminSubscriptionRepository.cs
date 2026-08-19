using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminSubscriptionRepository
{
    Task<AdminActivateSubscriptionResultDto?> ActivateSubscription(
        AdminActivateSubscriptionRequestDto dto,
        int adminUserId);
}