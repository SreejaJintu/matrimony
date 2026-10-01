using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminExecutiveService
{
    Task<IEnumerable<ExecutiveDto>> GetAllAsync(string? search, bool? isActive);
    Task<ExecutiveDto?> GetByIdAsync(int executiveId);
    Task<ExecutiveOperationResultDto> CreateAsync(CreateExecutiveRequestDto request);
    Task<ExecutiveOperationResultDto> UpdateAsync(int executiveId, UpdateExecutiveRequestDto request);
    Task<bool> UpdateStatusAsync(int executiveId, bool isActive);
}