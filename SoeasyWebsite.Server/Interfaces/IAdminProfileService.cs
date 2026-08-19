using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminProfileService
{
    Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId);

    Task<AdminProfileDetailResult?> GetById(int userId);

    Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId);
    Task<AdminMarkMarriedResult?> MarkAsMarried(
    int userId,
    int adminUserId);
}