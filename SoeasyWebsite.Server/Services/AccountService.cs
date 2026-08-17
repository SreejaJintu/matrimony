using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Account;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class AccountService : IAccountService
{
    private readonly IAccountRepository _accountRepository;

    public AccountService(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    public async Task<ApiResponse<AccountBasicsDto>> GetBasicsByUserId(int userId)
    {
        var account = await _accountRepository.GetBasicsByUserId(userId);

        if (account is null)
        {
            return new ApiResponse<AccountBasicsDto>
            {
                Success = false,
                Message = "Account details not found."
            };
        }

        return new ApiResponse<AccountBasicsDto>
        {
            Success = true,
            Message = "Account details fetched successfully.",
            Data = account
        };
    }

    public async Task<ApiResponse<bool>> UpsertBasics(UpsertAccountBasicsRequestDto dto)
    {
        var success = await _accountRepository.UpsertBasics(dto);
        return new ApiResponse<bool>
        {
            Success = success,
            Message = success ? "Account details saved successfully." : "Failed to save account details.",
            Data = success
        };
    }
}
