using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Match;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class MatchService : IMatchService
{
    private readonly IMatchRepository _matchRepository;

    public MatchService(IMatchRepository matchRepository)
    {
        _matchRepository = matchRepository;
    }

    public async Task<ApiResponse<IEnumerable<MatchCardDto>>> SearchMatches(MatchSearchRequestDto dto)
    {
        var matches = await _matchRepository.SearchMatches(dto);

        return new ApiResponse<IEnumerable<MatchCardDto>>
        {
            Success = true,
            Message = "Matches fetched successfully.",
            Data = matches
        };
    }
}
