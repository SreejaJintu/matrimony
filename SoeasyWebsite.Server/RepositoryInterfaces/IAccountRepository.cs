using SoeasyWebsite.Server.DTOs.Account;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAccountRepository
{
    Task<AccountBasicsDto?> GetBasicsByUserId(int userId);

    Task<bool> UpsertBasics(UpsertAccountBasicsRequestDto dto);
}
