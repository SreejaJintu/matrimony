using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminBrokerService
{
    Task<IEnumerable<BrokerDto>> GetAllAsync();
    Task<BrokerDto?> GetByIdAsync(int brokerId);
    Task<IEnumerable<AdminBrokerCandidateDto>> GetCandidatesAsync(int brokerId);
    Task<(int ResultCode, string Message, BrokerDto? Broker)> CreateAsync(CreateBrokerRequestDto request, int adminId);
    Task<bool> UpdateAsync(int brokerId, UpdateBrokerRequestDto request);
    Task<bool> DeactivateAsync(int brokerId);
    Task<bool> UpdateApprovalAsync(int brokerId, bool isApproved, int adminId);
}
