using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class AdminAuthRepository : IAdminAuthRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminAuthRepository(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<AdminUserLoginModel?> Login(
        string userName)
    {
        using var connection =
            _connectionFactory.CreateConnection();

        return await connection.QueryFirstOrDefaultAsync<AdminUserLoginModel>(
            "usp_Admin_Login",
            new
            {
                UserName = userName
            },
            commandType: CommandType.StoredProcedure
        );
    }
}