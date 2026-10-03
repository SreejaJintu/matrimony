using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Interfaces;
using System.Security.Claims;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Authorize(Policy = "MemberOnly")]
[Route("api/profile-shares")]
public sealed class ProfileSharesController : ControllerBase
{
    private readonly IProfileShareService _service;

    public ProfileSharesController(IProfileShareService service) => _service = service;

    [HttpGet("my")]
    public async Task<IActionResult> GetMine()
    {
        if (!TryGetMemberId(out var userId)) return Unauthorized();
        var data = await _service.GetMineAsync(userId);
        return Ok(new { success = true, data });
    }

    [HttpGet("{shareId:int}")]
    public async Task<IActionResult> GetMineById(int shareId)
    {
        if (shareId <= 0) return NotFound(new { success = false, message = "Shared profile not found." });
        if (!TryGetMemberId(out var userId)) return Unauthorized();

        var profile = await _service.GetMineByIdAsync(shareId, userId);
        if (profile is null)
            return NotFound(new { success = false, message = "Shared profile not found." });

        return Ok(new { success = true, data = profile });
    }

    private bool TryGetMemberId(out int userId)
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(value, out userId) && userId > 0;
    }
}
