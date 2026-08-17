using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Authentication;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<RegisterResponseDto>> Register(RegisterRequestDto dto);

    Task<ApiResponse<LoginResponseDto>> Login(LoginRequestDto dto);
}