using SoeasyWebsite.Server.DTOs.ProfileShare;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IProfileShareRepository
{
    Task<(bool Success, string? Error)> CreateAsync(int paidUserId, IReadOnlyCollection<int> profileUserIds, int adminId);
    Task<IReadOnlyList<SharedProfileDto>> GetMineAsync(int userId);
    Task<SharedProfileDto?> GetMineByIdAsync(int shareId, int userId);
}
