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
}