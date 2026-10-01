using SoeasyWebsite.Server.DTOs.Broker;

namespace SoeasyWebsite.Server.Interfaces;

public interface IBrokerCandidateService
{
    Task<IEnumerable<BrokerCandidateDto>> GetAllAsync(int brokerId);
    Task<BrokerCandidateDto?> GetByUserIdAsync(int brokerId, int userId);

    Task<CreateBrokerCandidateResponseDto?> CreateAsync(CreateBrokerCandidateRequestDto request, int brokerId);
}
