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
        var response = await _accountService.UpsertBasics(dto);
        return Ok(response);
    }
}
