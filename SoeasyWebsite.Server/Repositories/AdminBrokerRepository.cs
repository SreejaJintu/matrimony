using System.Data;
using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AdminBrokerRepository : IAdminBrokerRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminBrokerRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<BrokerDto>> GetAllAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<BrokerDto>(
            "usp_Admin_Broker_GetAll",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<BrokerCreateOutcomeDto> CreateAsync(
        CreateBrokerRequestDto request,
        string passwordHash,
        int adminId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleAsync<BrokerCreateOutcomeDto>(
            "usp_Admin_Broker_Register",
            new
            {
                request.FullName,
                request.MobileNumber,
                request.AccountEmail,
                PasswordHash = passwordHash,
                request.GenderId,
                request.BrokerName,
                request.CompanyName,
                ApprovedBy = adminId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<BrokerDto?> GetByIdAsync(int brokerId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<BrokerDto>(
            "usp_Admin_Broker_GetAll",
            new { BrokerId = brokerId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> UpdateAsync(int brokerId, UpdateBrokerRequestDto request)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            UPDATE dbo.BrokerProfile
            SET BrokerName = @BrokerName,
                CompanyName = @CompanyName,
                ContactNumber = @ContactNumber,
                Email = @Email
            WHERE BrokerId = @BrokerId;
            """;

        return await connection.ExecuteAsync(sql, new
        {
            BrokerId = brokerId,
            request.BrokerName,
            request.CompanyName,
            request.ContactNumber,
            request.Email,
        }) > 0;
    }

    public async Task<bool> DeactivateAsync(int brokerId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            UPDATE dbo.BrokerProfile
            SET IsActive = 0
            WHERE BrokerId = @BrokerId AND IsActive = 1;
            """;

        return await connection.ExecuteAsync(sql, new { BrokerId = brokerId }) > 0;
    }

    public async Task<bool> UpdateApprovalAsync(int brokerId, bool isApproved, int adminId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            UPDATE dbo.BrokerProfile
            SET IsApproved = @IsApproved,
                ApprovedBy = CASE WHEN @IsApproved = 1 THEN @AdminId ELSE NULL END,
                ApprovedAt = CASE WHEN @IsApproved = 1 THEN SYSUTCDATETIME() ELSE NULL END
            WHERE BrokerId = @BrokerId AND IsActive = 1;
            """;

        return await connection.ExecuteAsync(sql, new
        {
            BrokerId = brokerId,
            IsApproved = isApproved,
            AdminId = adminId,
        }) > 0;
    }
}