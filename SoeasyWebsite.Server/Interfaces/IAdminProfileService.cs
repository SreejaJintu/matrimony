using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminProfileService
{
    Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId);
}