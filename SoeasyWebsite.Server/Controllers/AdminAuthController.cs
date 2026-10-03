using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminAuthService _adminAuthService;

    public AdminAuthController(
        IAdminAuthService adminAuthService)
    {
        _adminAuthService = adminAuthService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        AdminLoginRequestDto dto)
    {
        var result = await _adminAuthService.Login(dto);

        if (result is null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid admin username or password."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Admin login successful.",
            data = result
        });
    }

    [HttpPut("credentials")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateCredentials([FromBody] AdminCredentialUpdateDto request)
    {
        if (!int.TryParse(User.FindFirst("adminId")?.Value, out var adminId))
            return Unauthorized(new { success = false, message = "Admin identity is unavailable." });

        if (string.IsNullOrWhiteSpace(request.CurrentPassword) ||
            string.IsNullOrWhiteSpace(request.UserName) || request.UserName.Trim().Length > 100 ||
            (request.Email?.Length ?? 0) > 200 ||
            (!string.IsNullOrWhiteSpace(request.NewPassword) && request.NewPassword.Length < 8))
        {
            return BadRequest(new { success = false, message = "Enter your current password, a username (up to 100 characters), an email up to 200 characters, and a new password of at least 8 characters when changing it." });
        }

        var result = await _adminAuthService.UpdateCredentials(
            adminId, request.CurrentPassword, request.UserName, request.Email, request.NewPassword);
        if (!result.Success)
        {
            var status = result.Message.Contains("incorrect", StringComparison.OrdinalIgnoreCase) ? 400 : 409;
            return StatusCode(status, new { success = false, message = result.Message });
        }
        return Ok(new { success = true, message = result.Message });
    }

    [HttpGet("admins")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetActiveAdmins()
    {
        if (!int.TryParse(User.FindFirst("adminId")?.Value, out var actorAdminId))
            return Unauthorized(new { success = false, message = "Admin identity is unavailable." });

        var admins = await _adminAuthService.GetActiveAdminsForSuperAdmin(actorAdminId);
        if (admins is null) return Forbid();
        return Ok(new { success = true, data = admins });
    }

    [HttpPut("admins/{targetAdminId:int}/password")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> ResetAdminPassword(int targetAdminId, [FromBody] AdminPasswordResetDto request)
    {
        if (!int.TryParse(User.FindFirst("adminId")?.Value, out var actorAdminId))
            return Unauthorized(new { success = false, message = "Admin identity is unavailable." });
        if (targetAdminId <= 0 || string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            return BadRequest(new { success = false, message = "Choose a password with at least 8 characters." });

        var reset = await _adminAuthService.ResetAdminPassword(actorAdminId, targetAdminId, request.NewPassword);
        if (!reset) return Forbid();
        return Ok(new { success = true, message = "Admin password reset successfully." });
    }
}
