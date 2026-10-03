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

    public async Task<AdminUserLoginModel?> GetById(int adminId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<AdminUserLoginModel>(
            "SELECT AdminId, FullName, UserName, Email, MobileNumber, PasswordHash, IsSuperAdmin, IsActive, LastLogin FROM dbo.AdminUser WHERE AdminId = @AdminId",
            new { AdminId = adminId });
    }

    public async Task<IReadOnlyList<AdminAccountSummary>> GetActiveAdmins()
    {
        using var connection = _connectionFactory.CreateConnection();
        var admins = await connection.QueryAsync<AdminAccountSummary>(
            "SELECT AdminId, FullName, UserName, Email FROM dbo.AdminUser WHERE IsActive = 1 ORDER BY FullName, AdminId");
        return admins.AsList();
    }

    public async Task<bool> IsActiveSuperAdmin(int adminId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM dbo.AdminUser WHERE AdminId = @AdminId AND IsActive = 1 AND IsSuperAdmin = 1) THEN 1 ELSE 0 END",
            new { AdminId = adminId });
    }

    public async Task<int> UpdateCredentials(int adminId, string userName, string? email, string? passwordHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        if (connection.State != ConnectionState.Open) connection.Open();
        using var transaction = connection.BeginTransaction(IsolationLevel.Serializable);

        var duplicate = await connection.ExecuteScalarAsync<bool>(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM dbo.AdminUser WITH (UPDLOCK, HOLDLOCK) WHERE UserName = @UserName AND AdminId <> @AdminId) THEN 1 ELSE 0 END",
            new { AdminId = adminId, UserName = userName }, transaction);
        if (duplicate)
        {
            transaction.Rollback();
            return 2;
        }

        var updated = await connection.ExecuteAsync(
            "UPDATE dbo.AdminUser SET UserName = @UserName, Email = @Email, PasswordHash = COALESCE(@PasswordHash, PasswordHash) WHERE AdminId = @AdminId AND IsActive = 1",
            new { AdminId = adminId, UserName = userName, Email = email, PasswordHash = passwordHash }, transaction);
        transaction.Commit();
        return updated > 0 ? 1 : 0;
    }

    public async Task<bool> ResetPassword(int adminId, string passwordHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(
            "UPDATE dbo.AdminUser SET PasswordHash = @PasswordHash WHERE AdminId = @AdminId AND IsActive = 1",
            new { AdminId = adminId, PasswordHash = passwordHash }) > 0;
    }
}
