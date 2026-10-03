namespace SoeasyWebsite.Server.DTOs.Notification;

public sealed class UserNotificationDto
{
    public int NotificationId { get; set; }
    public string? NotificationType { get; set; }
    public string? Title { get; set; }
    public string? Message { get; set; }
    public int? ReferenceId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
