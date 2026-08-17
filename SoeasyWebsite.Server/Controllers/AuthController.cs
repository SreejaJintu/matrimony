using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Authentication;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        var response = await _authService.Register(dto);
        return Ok(response);
    }

   [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
{
    try
    {
        var response = await _authService.Login(dto);
        return Ok(response);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new
        {
            Message = ex.Message,
            StackTrace = ex.StackTrace,
            InnerException = ex.InnerException?.Message
        });
    }
}
}
