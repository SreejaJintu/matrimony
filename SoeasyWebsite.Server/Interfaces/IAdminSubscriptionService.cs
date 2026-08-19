using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminSubscriptionService
{
    Task<ApiResponse<AdminActivateSubscriptionResultDto>> ActivateSubscription(
        AdminActivateSubscriptionRequestDto dto,
        int adminUserId);
}