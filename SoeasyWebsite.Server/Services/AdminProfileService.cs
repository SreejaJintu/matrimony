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
}