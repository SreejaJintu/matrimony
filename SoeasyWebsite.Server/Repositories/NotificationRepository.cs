using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Notification;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public sealed class NotificationRepository : INotificationRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public NotificationRepository(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<UserNotificationDto>> GetMineAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<UserNotificationDto>("""
            SELECT NotificationId, NotificationType, Title, Message, ReferenceId, IsRead, CreatedAt
            FROM dbo.UserNotification
            WHERE UserId = @UserId
            ORDER BY CreatedAt DESC, NotificationId DESC;
            """, new { UserId = userId });
        return rows.AsList();
    }

    public async Task<bool> MarkReadAsync(int notificationId, int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("""
            UPDATE dbo.UserNotification
            SET IsRead = 1, ReadAt = COALESCE(ReadAt, GETDATE())
            WHERE NotificationId = @NotificationId AND UserId = @UserId;
            """, new { NotificationId = notificationId, UserId = userId }) > 0;
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>("""
            SELECT COUNT(1)
            FROM dbo.UserNotification
            WHERE UserId = @UserId AND IsRead = 0;
            """, new { UserId = userId });
    }
}
