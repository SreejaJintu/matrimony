using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Account;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetBasicsByUserId(int userId)
    {
        var response = await _accountService.GetBasicsByUserId(userId);
        return Ok(response);
    }

    [HttpPut("basics")]
    public async Task<IActionResult> UpsertBasics([FromBody] UpsertAccountBasicsRequestDto dto)
    {
        dto.MobileNumber = string.IsNullOrWhiteSpace(dto.MobileNumber) ? null : dto.MobileNumber.Trim();

        if (dto.MobileNumber is not null &&
            await _accountService.IsMobileNumberInUse(dto.MobileNumber, dto.UserId))
        {
            return Conflict(new SoeasyWebsite.Server.Common.ApiResponse<bool>
            {
                Success = false,
                Message = "This mobile number is already registered.",
                Data = false,
            });
        }

        var response = await _accountService.UpsertBasics(dto);
        return Ok(response);
    }
}
