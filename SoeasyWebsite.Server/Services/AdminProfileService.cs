using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AdminProfileService : IAdminProfileService
{
    private readonly IAdminProfileRepository _repository;

    public AdminProfileService(
        IAdminProfileRepository repository)
    {
        _repository = repository;
    }
public async Task<AdminProfileDetailResult?> GetById(int userId)
{
    return await _repository.GetById(userId);
}
    public async Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId)
    {
        return await _repository.GetAll(
            search,
            genderId,
            profileStatusId);
    }

    public async Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId)
{
    return await _repository.UpdateStatus(
        userId,
        profileStatusId);
}

public async Task<AdminMarkMarriedResult?> MarkAsMarried(
    int userId,
    int adminUserId)
{
    return await _repository.MarkAsMarried(
        userId,
        adminUserId);
}
}