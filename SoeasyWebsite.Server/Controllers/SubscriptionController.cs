using Microsoft.AspNetCore.Mvc;
using Dapper;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Subscription;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/subscription")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly IDbConnectionFactory _connectionFactory;

    public SubscriptionController(
        ISubscriptionService subscriptionService,
        IDbConnectionFactory connectionFactory)
    {
        _subscriptionService = subscriptionService;
        _connectionFactory = connectionFactory;
    }

    [HttpPost("lead")]
    public async Task<IActionResult> CaptureLead([FromBody] CreateLeadRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.MobileNumber))
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "Name and Mobile Number are required."
            });
        }

        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            INSERT INTO [dbo].[Lead] ([UserId], [Name], [MobileNumber], [Email], [PreferredPlan], [Status], [CreatedAt])
            VALUES (@UserId, @Name, @MobileNumber, @Email, @PreferredPlan, 'New', GETDATE());";

        var result = await connection.ExecuteAsync(sql, dto);

        return Ok(new ApiResponse<bool>
        {
            Success = result > 0,
            Message = "Lead captured successfully."
        });
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
