using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/subscriptions")]
public class AdminSubscriptionController : ControllerBase
{
    private readonly IAdminSubscriptionService _service;

    public AdminSubscriptionController(
        IAdminSubscriptionService service)
    {
        _service = service;
    }

    [HttpPost("activate")]
    public async Task<IActionResult> ActivateSubscription(
        [FromBody] AdminActivateSubscriptionRequestDto dto)
    {
        // Temporary. Later get this from admin JWT.
        const int adminUserId = 1;

        var result = await _service.ActivateSubscription(
            dto,
            adminUserId);

        return Ok(result);
    }
}