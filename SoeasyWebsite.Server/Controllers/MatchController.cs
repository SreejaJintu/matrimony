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
}
