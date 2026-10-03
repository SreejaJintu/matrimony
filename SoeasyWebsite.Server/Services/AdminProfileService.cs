using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;
using SoeasyWebsite.Server.Helpers;

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

public async Task<IEnumerable<AdminProfilePhotoDto>> GetPhotos(int userId)
{
    return await _repository.GetPhotos(userId);
}

public async Task<bool> DeleteProfile(int userId)
{
    return await _repository.DeleteProfile(userId);
}

public async Task<bool> UpdateMobileNumber(int userId, string? mobileNumber)
{
    return await _repository.UpdateMobileNumber(userId, mobileNumber);
}

public async Task<bool> ResetPassword(int userId, string newPassword)
{
    return await _repository.ResetPassword(userId, PasswordHelper.Hash(newPassword));
}

    public async Task<AdminProfilePageDto> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId,
        int page,
        int pageSize)
    {
        return await _repository.GetAll(
            search,
            genderId,
            profileStatusId,
            page,
            pageSize);
    }

    public async Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId)
{
    return await _repository.UpdateStatus(
        userId,
        profileStatusId);
}

    public async Task<bool> UpdateMaritalStatus(int userId, bool isMarried)
    {
        return await _repository.UpdateMaritalStatus(userId, isMarried);
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
