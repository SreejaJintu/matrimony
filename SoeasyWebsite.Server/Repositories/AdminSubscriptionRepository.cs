using Dapper;
using Microsoft.Data.SqlClient;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class AdminSubscriptionRepository : IAdminSubscriptionRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminSubscriptionRepository(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<AdminActivateSubscriptionResultDto?> ActivateSubscription(
        AdminActivateSubscriptionRequestDto dto,
        int adminUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        try
        {
            return await connection.QueryFirstOrDefaultAsync<AdminActivateSubscriptionResultDto>(
                "usp_Admin_ActivateSubscription",
                new
                {
                    dto.UserId,
                    dto.MembershipPlanId,
                    dto.AmountPaid,
                    dto.PaymentReference,
                    dto.StartDate,
                    AdminUserId = adminUserId
                },
                commandType: CommandType.StoredProcedure);
        }
        catch (SqlException ex)
        {
            // The SP uses RAISERROR/THROW for business-rule violations
            // (e.g. "User already has an active subscription.").
            // Return a failure DTO so the service/controller can respond
            // with 200 + { success: false } instead of crashing with 500.
            return new AdminActivateSubscriptionResultDto
            {
                Success = false,
                Message = ex.Message
            };
        }
    }
}