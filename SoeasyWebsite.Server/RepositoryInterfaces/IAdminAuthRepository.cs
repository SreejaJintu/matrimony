using SoeasyWebsite.Server.Models;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAdminAuthRepository
{
    Task<AdminUserLoginModel?> Login(string userName);
}