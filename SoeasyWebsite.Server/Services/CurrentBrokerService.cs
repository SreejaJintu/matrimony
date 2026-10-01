using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class CurrentBrokerService : ICurrentBrokerService
{
    private readonly ICurrentBrokerRepository _repository;

    public CurrentBrokerService(ICurrentBrokerRepository repository)
    {
        _repository = repository;
    }

    public Task<int?> GetCurrentBrokerId(int userId)
    {
        if (userId <= 0)
        {
            return Task.FromResult<int?>(null);
        }

        return _repository.GetApprovedActiveBrokerIdByUserId(userId);
    }
}
