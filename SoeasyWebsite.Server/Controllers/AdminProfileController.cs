using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
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

    [HttpPut("{userId:int}/password")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> ResetPassword(int userId, [FromBody] AdminProfilePasswordResetDto request)
    {
        if (userId <= 0 || string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
        {
            return BadRequest(new { success = false, message = "A valid user ID and a password of at least 8 characters are required." });
        }

        var reset = await _service.ResetPassword(userId, request.NewPassword);
        if (!reset)
        {
            return NotFound(new { success = false, message = "Active user account not found." });
        }

        return Ok(new { success = true, message = "User password reset successfully." });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] byte? genderId = null,
        [FromQuery] byte? profileStatusId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var profiles = await _service.GetAll(
            search,
            genderId,
            profileStatusId,
            page,
            pageSize);

        return Ok(new
        {
            success = true,
            data = profiles.Items,
            pagination = new { profiles.TotalCount, profiles.Page, profiles.PageSize, TotalPages = (int)Math.Ceiling(profiles.TotalCount / (double)profiles.PageSize) }
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

public class AdminProfilePasswordResetDto
{
    public string NewPassword { get; set; } = string.Empty;
}

[HttpGet("{userId:int}/photos")]
public async Task<IActionResult> GetPhotos(int userId)
{
    var photos = await _service.GetPhotos(userId);

    return Ok(new
    {
        success = true,
        data = photos
    });
}

[HttpDelete("{userId:int}/photos/{photoId:int}")]
[Authorize(Policy = "AdminOnly")]
public async Task<IActionResult> DeletePhoto(int userId, int photoId)
{
    if (userId <= 0 || photoId <= 0)
    {
        return BadRequest(new { success = false, message = "A valid user ID and photo ID are required." });
    }

    var deleted = await _service.DeletePhoto(userId, photoId);
    if (!deleted)
    {
        return NotFound(new { success = false, message = "Active profile photo not found." });
    }

    return Ok(new { success = true, message = "Profile photo removed successfully." });
}

[HttpPut("{userId:int}/photos/{photoId:int}/profile")]
[Authorize(Policy = "AdminOnly")]
public async Task<IActionResult> SetProfilePhoto(int userId, int photoId)
{
    if (userId <= 0 || photoId <= 0)
    {
        return BadRequest(new { success = false, message = "A valid user ID and photo ID are required." });
    }

    var updated = await _service.SetProfilePhoto(userId, photoId);
    if (!updated)
    {
        return NotFound(new { success = false, message = "Eligible active profile photo not found." });
    }

    return Ok(new { success = true, message = "Profile photo updated successfully." });
}

[HttpDelete("{userId:int}")]
public async Task<IActionResult> DeleteProfile(int userId)
{
    var deleted = await _service.DeleteProfile(userId);

    if (!deleted)
    {
        return NotFound(new
        {
            success = false,
            message = "Profile not found or already deleted."
        });
    }

    return Ok(new
    {
        success = true,
        message = "Profile deleted successfully."
    });
}

[HttpPut("{userId:int}/mobile")]
public async Task<IActionResult> UpdateMobileNumber(
    int userId,
    [FromBody] AdminProfileMobileUpdateDto request)
{
    if (userId <= 0)
    {
        return BadRequest(new
        {
            success = false,
            message = "A valid user ID is required."
        });
    }

    var mobileNumber = string.IsNullOrWhiteSpace(request.MobileNumber)
        ? null
        : request.MobileNumber.Trim();
    var updated = await _service.UpdateMobileNumber(userId, mobileNumber);

    if (!updated)
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
        message = "Phone number updated successfully."
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

[HttpPut("{userId:int}/marital-status")]
public async Task<IActionResult> UpdateMaritalStatus(
    int userId,
    [FromBody] AdminProfileMaritalStatusUpdateDto request)
{
    if (userId <= 0)
    {
        return BadRequest(new
        {
            success = false,
            message = "A valid user ID is required."
        });
    }

    var updated = await _service.UpdateMaritalStatus(userId, request.IsMarried);
    if (!updated)
    {
        return NotFound(new
        {
            success = false,
            message = "Active profile not found."
        });
    }

    return Ok(new
    {
        success = true,
        message = request.IsMarried ? "Profile marked as married." : "Married status removed.",
        isMarried = request.IsMarried
    });
}
}
