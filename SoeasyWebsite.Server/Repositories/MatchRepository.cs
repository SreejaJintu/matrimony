using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Match;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public MatchRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<MatchCardDto>> SearchMatches(MatchSearchRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryAsync<MatchCardDto>(
            "usp_Match_Search",
            new
            {
                dto.UserId
            },
            commandType: CommandType.StoredProcedure);
    }
}
