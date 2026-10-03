using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.ProfileShare;
using SoeasyWebsite.Server.Interfaces;
using System.Security.Claims;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/profile-shares")]
public sealed class AdminProfileSharesController : ControllerBase
{
    private readonly IProfileShareService _service;

    public AdminProfileSharesController(IProfileShareService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProfileShareRequestDto request)
    {
        if (request.PaidUserId <= 0)
            return BadRequest(new { success = false, message = "A valid paidUserId is required." });

        var profileIds = request.ProfileUserIds ?? [];
        if (profileIds.Count is < 1 or > 2)
            return BadRequest(new { success = false, message = "Select between 1 and 2 profiles." });

        if (profileIds.Any(id => id <= 0))
            return BadRequest(new { success = false, message = "Profile IDs must be positive integers." });

        if (profileIds.Distinct().Count() != profileIds.Count)
            return BadRequest(new { success = false, message = "Duplicate profile IDs are not allowed." });

        if (!int.TryParse(User.FindFirstValue("adminId"), out var adminId) || adminId <= 0)
            return Unauthorized(new { success = false, message = "The authenticated Admin ID is missing." });

        var result = await _service.CreateAsync(request.PaidUserId, profileIds, adminId);
        if (!result.Success)
            return BadRequest(new { success = false, message = result.Error });

        return Ok(new { success = true, message = "Profiles shared successfully." });
    }
}
