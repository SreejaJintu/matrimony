using SoeasyWebsite.Server.DTOs.Match;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IMatchRepository
{
    Task<IEnumerable<MatchCardDto>> SearchMatches(MatchSearchRequestDto dto);
}
