using SoeasyWebsite.Server.DTOs.Account;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAccountRepository
{
    Task<AccountBasicsDto?> GetBasicsByUserId(int userId);

    Task<bool> IsMobileNumberInUse(string mobileNumber, int excludingUserId);

    Task<bool> UpsertBasics(UpsertAccountBasicsRequestDto dto);
}
