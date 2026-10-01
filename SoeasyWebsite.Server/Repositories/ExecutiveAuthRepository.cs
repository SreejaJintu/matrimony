using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class ExecutiveAuthRepository : IExecutiveAuthRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public ExecutiveAuthRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<ExecutiveLoginModel?> Login(string userName)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            SELECT ExecutiveId, FullName, UserName, Email, MobileNumber, PasswordHash, IsActive
            FROM dbo.Executive
            WHERE UserName = @UserName;";

        return await connection.QuerySingleOrDefaultAsync<ExecutiveLoginModel>(sql, new { UserName = userName });
    }
}
