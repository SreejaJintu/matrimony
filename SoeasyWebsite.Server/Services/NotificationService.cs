using SoeasyWebsite.Server.DTOs.Notification;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public sealed class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;

    public NotificationService(INotificationRepository repository) => _repository = repository;

    public Task<IReadOnlyList<UserNotificationDto>> GetMineAsync(int userId)
        => _repository.GetMineAsync(userId);

    public Task<bool> MarkReadAsync(int notificationId, int userId)
        => _repository.MarkReadAsync(notificationId, userId);

    public Task<int> GetUnreadCountAsync(int userId)
        => _repository.GetUnreadCountAsync(userId);
}
