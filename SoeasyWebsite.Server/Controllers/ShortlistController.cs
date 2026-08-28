using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Services;
using System.Security.Claims;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ShortlistController : ControllerBase
{
    private readonly ShortlistService _service;

    public ShortlistController(ShortlistService service)
    {
        _service = service;
    }

    [HttpPost("{targetUserId:int}")]
    public async Task<IActionResult> Add(int targetUserId)
    {
        var userId = GetCurrentUserId();

        var result = await _service.Add(userId, targetUserId);

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            data = result
        });
    }

    [HttpDelete("{targetUserId:int}")]
    public async Task<IActionResult> Remove(int targetUserId)
    {
        var userId = GetCurrentUserId();

        var result = await _service.Remove(userId, targetUserId);

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            data = result
        });
    }

    [HttpGet("check/{targetUserId:int}")]
    public async Task<IActionResult> Check(int targetUserId)
    {
        var userId = GetCurrentUserId();

        var result = await _service.Check(userId, targetUserId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetCurrentUserId();

        var result = await _service.Get(userId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return userId;
    }
}
