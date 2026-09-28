using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminBrokerService : IAdminBrokerService
{
    private readonly IAdminBrokerRepository _repository;

    public AdminBrokerService(IAdminBrokerRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<BrokerDto>> GetAllAsync() => _repository.GetAllAsync();

    public Task<BrokerDto?> GetByIdAsync(int brokerId) => _repository.GetByIdAsync(brokerId);

    public Task<bool> UpdateAsync(int brokerId, UpdateBrokerRequestDto request) =>
        _repository.UpdateAsync(brokerId, request);

    public Task<bool> DeactivateAsync(int brokerId) => _repository.DeactivateAsync(brokerId);

    public Task<bool> UpdateApprovalAsync(int brokerId, bool isApproved, int adminId) =>
        _repository.UpdateApprovalAsync(brokerId, isApproved, adminId);

    public async Task<(int ResultCode, string Message, BrokerDto? Broker)> CreateAsync(
        CreateBrokerRequestDto request,
        int adminId)
    {
        var passwordHash = PasswordHelper.Hash(request.Password);
        var outcome = await _repository.CreateAsync(request, passwordHash, adminId);
        var broker = outcome.ResultCode == 1 && outcome.BrokerId.HasValue
            ? await _repository.GetByIdAsync(outcome.BrokerId.Value)
            : null;

        return (outcome.ResultCode, outcome.Message, broker);
    }
}