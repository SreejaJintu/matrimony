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

    [HttpPut("{planId:int}")]
    public async Task<IActionResult> UpdatePlan(int planId, [FromBody] CreatePlanRequestDto dto)
    {
        if (planId <= 0)
        {
            return BadRequest(new { success = false, message = "A valid plan ID is required." });
        }

        var result = await _service.UpdatePlanAsync(planId, dto);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{planId:int}")]
    public async Task<IActionResult> DeactivatePlan(int planId)
    {
        if (planId <= 0)
        {
            return BadRequest(new { success = false, message = "A valid plan ID is required." });
        }

        var deactivated = await _service.DeactivatePlanAsync(planId);
        return deactivated ? NoContent() : NotFound();
    }
}