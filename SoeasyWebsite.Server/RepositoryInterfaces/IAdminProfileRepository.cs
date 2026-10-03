using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminProfileRepository
{
    Task<AdminProfilePageDto> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId,
        int page,
        int pageSize);

    Task<AdminProfileDetailResult?> GetById(int userId);

    Task<IEnumerable<AdminProfilePhotoDto>> GetPhotos(int userId);

    Task<bool> DeleteProfile(int userId);

    Task<bool> UpdateMobileNumber(int userId, string? mobileNumber);

    Task<bool> ResetPassword(int userId, string passwordHash);

    Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId);

    Task<bool> UpdateMaritalStatus(int userId, bool isMarried);

    Task<AdminMarkMarriedResult?> MarkAsMarried(
    int userId,
    int adminUserId);
}
