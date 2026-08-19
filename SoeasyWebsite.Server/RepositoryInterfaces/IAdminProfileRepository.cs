using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminProfileRepository
{
    Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId);
}