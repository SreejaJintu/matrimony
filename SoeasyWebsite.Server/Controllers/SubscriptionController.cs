using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Subscription;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/subscription")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost("submit-payment")]
    public async Task<IActionResult> SubmitPayment([FromBody] SubmitPaymentRequestDto dto)
    {
        var response = await _subscriptionService.SubmitPayment(dto);
        return Ok(response);
    }

    [HttpPut("approve/{subscriptionId}")]
    public async Task<IActionResult> ApproveSubscription(
        [FromRoute] int subscriptionId,
        [FromQuery] int adminUserId = 1)
    {
        var response = await _subscriptionService.ApproveSubscription(subscriptionId, adminUserId);
        return Ok(response);
    }

    [HttpGet("status/{userId}")]
    public async Task<IActionResult> GetStatus([FromRoute] int userId)
    {
        var response = await _subscriptionService.GetStatus(userId);
        return Ok(response);
    }

    [HttpPost("unlock")]
    public async Task<IActionResult> UnlockProfile(
        [FromQuery] int viewerUserId,
        [FromQuery] int targetUserId)
    {
        var response = await _subscriptionService.UnlockProfile(viewerUserId, targetUserId);
        return Ok(response);
    }

    [HttpPut("mark-married/{userId}")]
    public async Task<IActionResult> MarkProfileAsMarried(
        [FromRoute] int userId,
        [FromQuery] int adminUserId = 1)
    {
        var response = await _subscriptionService.MarkProfileAsMarried(userId, adminUserId);
        return Ok(response);
    }
}
