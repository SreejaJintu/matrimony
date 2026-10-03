using SoeasyWebsite.Server.DTOs.ProfileShare;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public sealed class ProfileShareService : IProfileShareService
{
    private readonly IProfileShareRepository _repository;

    public ProfileShareService(IProfileShareRepository repository) => _repository = repository;

    public Task<(bool Success, string? Error)> CreateAsync(int paidUserId, IReadOnlyCollection<int> profileUserIds, int adminId)
        => _repository.CreateAsync(paidUserId, profileUserIds, adminId);

    public Task<IReadOnlyList<SharedProfileDto>> GetMineAsync(int userId)
        => _repository.GetMineAsync(userId);

    public Task<SharedProfileDto?> GetMineByIdAsync(int shareId, int userId)
        => _repository.GetMineByIdAsync(shareId, userId);
}
