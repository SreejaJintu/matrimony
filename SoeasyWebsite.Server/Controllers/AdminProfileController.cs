using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.DTOs.Admin;
namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/profiles")]
public class AdminProfileController : ControllerBase
{
    private readonly IAdminProfileService _service;

    public AdminProfileController(
        IAdminProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] byte? genderId = null,
        [FromQuery] byte? profileStatusId = null)
    {
        var profiles = await _service.GetAll(
            search,
            genderId,
            profileStatusId);

        return Ok(new
        {
            success = true,
            data = profiles
        });
    }
    [HttpGet("{userId:int}")]
public async Task<IActionResult> GetById(int userId)
{
    var profile = await _service.GetById(userId);

    if (profile == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Profile not found."
        });
    }

    return Ok(new
    {
        success = true,
        data = profile
    });
}

[HttpPut("{userId:int}/status")]
public async Task<IActionResult> UpdateStatus(
    int userId,
    [FromBody] AdminProfileStatusUpdateDto request)
{
    var result = await _service.UpdateStatus(
        userId,
        request.ProfileStatusId);

    if (result == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Unable to update profile status."
        });
    }

    if (!result.Success)
    {
        return BadRequest(result);
    }

    return Ok(result);
}

[HttpPut("{userId:int}/married")]
public async Task<IActionResult> MarkAsMarried(
    int userId)
{
    // Temporary admin ID.
    // We will replace this with the logged-in admin ID
    // when admin JWT authorization is connected.
    const int adminUserId = 1;

    var result = await _service.MarkAsMarried(
        userId,
        adminUserId);

    if (result == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Unable to mark profile as married."
        });
    }

    return Ok(result);
}
}