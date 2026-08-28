using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/plans")]
public class AdminPlanController : ControllerBase
{
    private readonly IAdminPlanService _service;

    public AdminPlanController(IAdminPlanService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPlans()
    {
        var result = await _service.GetAllPlansAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlan([FromBody] CreatePlanRequestDto dto)
    {
        var result = await _service.CreatePlanAsync(dto);
        return Ok(result);
    }
}