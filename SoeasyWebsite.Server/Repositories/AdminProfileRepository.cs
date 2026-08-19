using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class AdminProfileRepository : IAdminProfileRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminProfileRepository(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId)
    {
        using var connection =
            _connectionFactory.CreateConnection();

        var result =
            await connection.QueryAsync<AdminProfileDto>(
                "usp_Admin_Profile_GetAll",
                new
                {
                    Search = search,
                    GenderId = genderId,
                    ProfileStatusId = profileStatusId
                },
                commandType: CommandType.StoredProcedure
            );

        return result;
    }
   public async Task<AdminProfileDetailResult?> GetById(int userId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    var result =
        await connection.QueryFirstOrDefaultAsync<AdminProfileDetailResult>(
            "usp_Admin_Profile_GetById",
            new
            {
                UserId = userId
            },
            commandType: CommandType.StoredProcedure
        );

    return result;
}

public async Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<AdminProfileStatusUpdateResult>(
        "usp_Admin_Profile_UpdateStatus",
        new
        {
            UserId = userId,
            ProfileStatusId = profileStatusId
        },
        commandType: CommandType.StoredProcedure
    );
}
public async Task<AdminMarkMarriedResult?> MarkAsMarried(
    int userId,
    int adminUserId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<AdminMarkMarriedResult>(
        "usp_Admin_MarkProfileAsMarried",
        new
        {
            MarriedUserId = userId,
            AdminUserId = adminUserId
        },
        commandType: CommandType.StoredProcedure
    );
}
}