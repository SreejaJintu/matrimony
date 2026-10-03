using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Match;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly IMatchService _matchService;

    public MatchController(IMatchService matchService)
    {
        _matchService = matchService;
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchMatches([FromBody] MatchSearchRequestDto dto)
    {
        var response = await _matchService.SearchMatches(dto);
        return Ok(response);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProfiles()
    {
        var response = await _matchService.SearchMatches(new MatchSearchRequestDto { Limit = 8 });
        return Ok(response);
    }
}
