using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminBrokerRepository
{
    Task<IEnumerable<BrokerDto>> GetAllAsync();
    Task<BrokerCreateOutcomeDto> CreateAsync(CreateBrokerRequestDto request, string passwordHash, int adminId);
    Task<BrokerDto?> GetByIdAsync(int brokerId);
    Task<bool> UpdateAsync(int brokerId, UpdateBrokerRequestDto request);
    Task<bool> DeactivateAsync(int brokerId);
    Task<bool> UpdateApprovalAsync(int brokerId, bool isApproved, int adminId);
}