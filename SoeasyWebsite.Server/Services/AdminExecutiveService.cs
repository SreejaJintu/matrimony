using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminExecutiveService : IAdminExecutiveService
{
    private readonly IAdminExecutiveRepository _repository;

    public AdminExecutiveService(IAdminExecutiveRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<ExecutiveDto>> GetAllAsync(string? search, bool? isActive) =>
        _repository.GetAllAsync(NormalizeOptional(search), isActive);

    public Task<ExecutiveDto?> GetByIdAsync(int executiveId) =>
        _repository.GetByIdAsync(executiveId);

    public Task<ExecutiveOperationResultDto> CreateAsync(CreateExecutiveRequestDto request)
    {
        Normalize(request);
        return _repository.CreateAsync(request, PasswordHelper.Hash(request.Password));
    }

    public Task<ExecutiveOperationResultDto> UpdateAsync(
        int executiveId,
        UpdateExecutiveRequestDto request)
    {
        Normalize(request);
        return _repository.UpdateAsync(executiveId, request);
    }

    public Task<bool> UpdateStatusAsync(int executiveId, bool isActive) =>
        _repository.UpdateStatusAsync(executiveId, isActive);

    private static void Normalize(CreateExecutiveRequestDto request)
    {
        request.FullName = request.FullName.Trim();
        request.UserName = request.UserName.Trim();
        request.Email = NormalizeOptional(request.Email);
        request.MobileNumber = NormalizeOptional(request.MobileNumber);
    }

    private static void Normalize(UpdateExecutiveRequestDto request)
    {
        request.FullName = request.FullName.Trim();
        request.UserName = request.UserName.Trim();
        request.Email = NormalizeOptional(request.Email);
        request.MobileNumber = NormalizeOptional(request.MobileNumber);
    }

    private static string? NormalizeOptional(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}