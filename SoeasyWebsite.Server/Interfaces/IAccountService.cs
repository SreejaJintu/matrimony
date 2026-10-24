using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Account;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAccountService
{
    Task<ApiResponse<AccountBasicsDto>> GetBasicsByUserId(int userId);

    Task<bool> IsMobileNumberInUse(string mobileNumber, int excludingUserId);

    Task<ApiResponse<bool>> UpsertBasics(UpsertAccountBasicsRequestDto dto);
}
