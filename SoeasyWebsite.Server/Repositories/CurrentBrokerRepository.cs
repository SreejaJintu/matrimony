using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class CurrentBrokerRepository : ICurrentBrokerRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public CurrentBrokerRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<int?> GetApprovedActiveBrokerIdByUserId(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            SELECT BrokerId
            FROM dbo.BrokerProfile
            WHERE UserId = @UserId
              AND IsApproved = 1
              AND IsActive = 1;
            """;

        return await connection.QuerySingleOrDefaultAsync<int?>(sql, new { UserId = userId });
    }
}
