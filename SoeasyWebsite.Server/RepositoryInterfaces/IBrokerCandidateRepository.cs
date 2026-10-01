using SoeasyWebsite.Server.DTOs.Broker;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IBrokerCandidateRepository
{
    Task<IEnumerable<BrokerCandidateDto>> GetAllAsync(int brokerId);
    Task<BrokerCandidateDto?> GetByUserIdAsync(int brokerId, int userId);

    Task<CreateBrokerCandidateResponseDto?> CreateAsync(
        CreateBrokerCandidateRequestDto request,
        int brokerId,
        string passwordHash);
}
