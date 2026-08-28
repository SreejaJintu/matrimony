using SoeasyWebsite.Server.DTOs.Shortlist;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class ShortlistService
{
    private readonly IShortlistRepository _repository;

    public ShortlistService(IShortlistRepository repository)
    {
        _repository = repository;
    }

    public Task<ShortlistResultDto> Add(
        int fromUserId,
        int toUserId)
        => _repository.Add(fromUserId, toUserId);

    public Task<ShortlistResultDto> Remove(
        int fromUserId,
        int toUserId)
        => _repository.Remove(fromUserId, toUserId);

    public Task<ShortlistStatusDto> Check(
        int fromUserId,
        int toUserId)
        => _repository.Check(fromUserId, toUserId);

    public Task<IEnumerable<ShortlistedProfileDto>> Get(
        int userId)
        => _repository.Get(userId);
}
