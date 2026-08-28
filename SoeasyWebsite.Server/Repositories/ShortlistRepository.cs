using System.Data;
using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Shortlist;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class ShortlistRepository : IShortlistRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public ShortlistRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<ShortlistResultDto> Add(
        int fromUserId,
        int toUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<ShortlistResultDto>(
            "usp_Shortlist_Add",
            new
            {
                FromUserId = fromUserId,
                ToUserId = toUserId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ShortlistResultDto> Remove(
        int fromUserId,
        int toUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<ShortlistResultDto>(
            "usp_Shortlist_Remove",
            new
            {
                FromUserId = fromUserId,
                ToUserId = toUserId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ShortlistStatusDto> Check(
        int fromUserId,
        int toUserId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<ShortlistStatusDto>(
            "usp_Shortlist_Check",
            new
            {
                FromUserId = fromUserId,
                ToUserId = toUserId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<ShortlistedProfileDto>> Get(
        int userId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryAsync<ShortlistedProfileDto>(
            "usp_Shortlist_Get",
            new
            {
                UserId = userId
            },
            commandType: CommandType.StoredProcedure);
    }
}
