using Dapper;
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
}