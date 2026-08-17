using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Subscription;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public SubscriptionRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<SubmitPaymentResultDto> SubmitPayment(SubmitPaymentRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        var result = await connection.QueryFirstOrDefaultAsync<SubmitPaymentResultDto>(
            "usp_Subscription_SubmitPayment",
            new
            {
                dto.UserId,
                dto.PaymentReference,
                dto.MembershipPlanId,
                dto.AmountPaid
            },
            commandType: CommandType.StoredProcedure);

        return result ?? new SubmitPaymentResultDto
        {
            SubscriptionId = 0,
            Success = false,
            Message = "Payment submission failed."
        };
    }

    public async Task<bool> ApproveSubscription(int subscriptionId, int adminUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "usp_Subscription_Approve",
            new
            {
                SubscriptionId = subscriptionId,
                AdminUserId = adminUserId
            },
            commandType: CommandType.StoredProcedure);

        if (result == null) return false;

        // Handle both int and bool return types from the stored procedure
        var rawSuccess = (object)result.Success;
        return rawSuccess is int i ? i == 1 : Convert.ToBoolean(rawSuccess);
    }

    public async Task<SubscriptionStatusDto?> GetStatus(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstOrDefaultAsync<SubscriptionStatusDto>(
            "usp_Subscription_GetStatus",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ProfileUnlockResultDto> UnlockProfile(int viewerUserId, int targetUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        var result = await connection.QueryFirstOrDefaultAsync<ProfileUnlockResultDto>(
            "usp_Profile_UnlockView",
            new
            {
                ViewerUserId = viewerUserId,
                TargetUserId = targetUserId
            },
            commandType: CommandType.StoredProcedure);

        return result ?? new ProfileUnlockResultDto
        {
            CanView = false,
            IsOwnProfile = false,
            CreditDeducted = false,
            RemainingCredits = 0,
            Message = "Unable to process unlock request."
        };
    }

    public async Task<MarriedRefundResultDto> MarkProfileAsMarried(int marriedUserId, int adminUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        var result = await connection.QueryFirstOrDefaultAsync<MarriedRefundResultDto>(
            "usp_Admin_MarkProfileAsMarried",
            new
            {
                MarriedUserId = marriedUserId,
                AdminUserId = adminUserId
            },
            commandType: CommandType.StoredProcedure);

        return result ?? new MarriedRefundResultDto
        {
            Success = false,
            MarriedUserId = marriedUserId,
            ProfilesRefunded = 0,
            Message = "Failed to mark profile as married."
        };
    }
}
