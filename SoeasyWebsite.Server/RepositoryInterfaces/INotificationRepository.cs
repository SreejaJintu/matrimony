using SoeasyWebsite.Server.DTOs.Notification;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface INotificationRepository
{
    Task<IReadOnlyList<UserNotificationDto>> GetMineAsync(int userId);
    Task<bool> MarkReadAsync(int notificationId, int userId);
    Task<int> GetUnreadCountAsync(int userId);
}
