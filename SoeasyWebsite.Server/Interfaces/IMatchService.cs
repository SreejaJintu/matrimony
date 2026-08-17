using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Match;

namespace SoeasyWebsite.Server.Interfaces;

public interface IMatchService
{
    Task<ApiResponse<IEnumerable<MatchCardDto>>> SearchMatches(MatchSearchRequestDto dto);
}
