using SoeasyWebsite.Server.DTOs.Shortlist;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IShortlistRepository
{
    Task<ShortlistResultDto> Add(int fromUserId, int toUserId);

    Task<ShortlistResultDto> Remove(int fromUserId, int toUserId);

    Task<ShortlistStatusDto> Check(int fromUserId, int toUserId);

    Task<IEnumerable<ShortlistedProfileDto>> Get(int userId);
}
