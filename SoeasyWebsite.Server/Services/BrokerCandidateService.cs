using SoeasyWebsite.Server.DTOs.Broker;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class BrokerCandidateService : IBrokerCandidateService
{
    private readonly IBrokerCandidateRepository _repository;

    public BrokerCandidateService(IBrokerCandidateRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<BrokerCandidateDto>> GetAllAsync(int brokerId)
    {
        if (brokerId <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(brokerId));
        }

        return _repository.GetAllAsync(brokerId);
    }

    public Task<BrokerCandidateDto?> GetByUserIdAsync(int brokerId, int userId)
    {
        if (brokerId <= 0 || userId <= 0)
        {
            return Task.FromResult<BrokerCandidateDto?>(null);
        }

        return _repository.GetByUserIdAsync(brokerId, userId);
    }

    public Task<CreateBrokerCandidateResponseDto?> CreateAsync(CreateBrokerCandidateRequestDto request, int brokerId)
    {
        if (brokerId <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(brokerId));
        }

        var passwordHash = PasswordHelper.Hash(request.Password);
        return _repository.CreateAsync(request, brokerId, passwordHash);
    }
}
