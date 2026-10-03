using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Interfaces;
using System.Security.Claims;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Authorize(Policy = "MemberOnly")]
[Route("api/notifications")]
public sealed class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationsController(INotificationService service) => _service = service;

    [HttpGet("my")]
    public async Task<IActionResult> GetMine()
    {
        if (!TryGetMemberId(out var userId)) return Unauthorized();
        var data = await _service.GetMineAsync(userId);
        return Ok(new { success = true, data });
    }

    [HttpPut("{notificationId:int}/read")]
    public async Task<IActionResult> MarkRead(int notificationId)
    {
        if (notificationId <= 0) return NotFound(new { success = false, message = "Notification not found." });
        if (!TryGetMemberId(out var userId)) return Unauthorized();
        var updated = await _service.MarkReadAsync(notificationId, userId);
        if (!updated) return NotFound(new { success = false, message = "Notification not found." });
        return Ok(new { success = true, message = "Notification marked as read." });
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        if (!TryGetMemberId(out var userId)) return Unauthorized();
        return Ok(new { count = await _service.GetUnreadCountAsync(userId) });
    }

    private bool TryGetMemberId(out int userId)
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(value, out userId) && userId > 0;
    }
}
