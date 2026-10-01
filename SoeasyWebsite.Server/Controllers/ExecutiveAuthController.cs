using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Executive;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/executive")]
public class ExecutiveAuthController : ControllerBase
{
    private readonly IExecutiveAuthService _service;

    public ExecutiveAuthController(IExecutiveAuthService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] ExecutiveLoginRequestDto dto)
    {
        var result = await _service.Login(dto);
        if (result is null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid Executive username or password, or the account is inactive."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Executive login successful.",
            data = result
        });
    }
}
