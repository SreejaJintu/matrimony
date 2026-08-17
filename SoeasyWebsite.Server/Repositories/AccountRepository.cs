using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Account;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AccountRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<AccountBasicsDto?> GetBasicsByUserId(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();

        const string sql = """
            SELECT
                UserId,
                ProfileCode,
                FullName,
                MobileNumber,
                Email,
                GenderId
            FROM UserAccount
            WHERE UserId = @UserId
              AND IsActive = 1;
            """;

        return await connection.QueryFirstOrDefaultAsync<AccountBasicsDto>(sql, new { UserId = userId });
    }

    public async Task<bool> UpsertBasics(UpsertAccountBasicsRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        const string sql = """
            UPDATE UserAccount
            SET FullName = @FullName,
                MobileNumber = @MobileNumber,
                Email = @Email,
                GenderId = COALESCE(@GenderId, GenderId),
                UpdatedAt = GETDATE()
            WHERE UserId = @UserId
              AND IsActive = 1;
            """;

        return await connection.ExecuteAsync(sql, dto) > 0;
    }
}
