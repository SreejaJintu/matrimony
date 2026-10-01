using SoeasyWebsite.Server.Models;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IExecutiveAuthRepository
{
    Task<ExecutiveLoginModel?> Login(string userName);
}
