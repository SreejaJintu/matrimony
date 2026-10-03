using SoeasyWebsite.Server.DTOs.ProfileShare;

namespace SoeasyWebsite.Server.Interfaces;

public interface IProfileShareService
{
    Task<(bool Success, string? Error)> CreateAsync(int paidUserId, IReadOnlyCollection<int> profileUserIds, int adminId);
    Task<IReadOnlyList<SharedProfileDto>> GetMineAsync(int userId);
    Task<SharedProfileDto?> GetMineByIdAsync(int shareId, int userId);
}
