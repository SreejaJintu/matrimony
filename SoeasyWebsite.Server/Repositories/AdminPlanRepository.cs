using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AdminPlanRepository : IAdminPlanRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminPlanRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<PlanResponseDto>> GetAllPlansAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            SELECT MembershipPlanId, PlanName, Amount, ValidityDays, 
                   CanViewContact, CanChat, UnlimitedInterest, IsActive, 
                   ProfileViewCredits, ProfileViewLimit 
            FROM dbo.MembershipPlanMaster;";

        return await connection.QueryAsync<PlanResponseDto>(sql);
    }

    public async Task<int> CreatePlanAsync(CreatePlanRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            INSERT INTO dbo.MembershipPlanMaster 
                (PlanName, Amount, ValidityDays, CanViewContact, CanChat, UnlimitedInterest, IsActive, ProfileViewCredits, ProfileViewLimit)
            VALUES 
                (@PlanName, @Amount, @ValidityDays, @CanViewContact, @CanChat, @UnlimitedInterest, @IsActive, @ProfileViewCredits, @ProfileViewLimit);
            SELECT CAST(SCOPE_IDENTITY() as int);";

        return await connection.ExecuteScalarAsync<int>(sql, dto);
    }

    public async Task<bool> UpdatePlanAsync(int planId, CreatePlanRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            UPDATE dbo.MembershipPlanMaster
            SET PlanName = @PlanName,
                Amount = @Amount,
                ValidityDays = @ValidityDays,
                CanViewContact = @CanViewContact,
                CanChat = @CanChat,
                UnlimitedInterest = @UnlimitedInterest,
                IsActive = @IsActive,
                ProfileViewCredits = @ProfileViewCredits,
                ProfileViewLimit = @ProfileViewLimit
            WHERE MembershipPlanId = @PlanId;";

        return await connection.ExecuteAsync(sql, new
        {
            PlanId = planId,
            dto.PlanName,
            dto.Amount,
            dto.ValidityDays,
            dto.CanViewContact,
            dto.CanChat,
            dto.UnlimitedInterest,
            dto.IsActive,
            dto.ProfileViewCredits,
            dto.ProfileViewLimit,
        }) > 0;
    }

    public async Task<bool> DeactivatePlanAsync(int planId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            UPDATE dbo.MembershipPlanMaster
            SET IsActive = 0
            WHERE MembershipPlanId = @PlanId AND IsActive = 1;";

        return await connection.ExecuteAsync(sql, new { PlanId = planId }) > 0;
    }
}