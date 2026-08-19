using Microsoft.AspNetCore.Mvc;
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
}