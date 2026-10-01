using SoeasyWebsite.Server.DTOs.Executive;

namespace SoeasyWebsite.Server.Interfaces;

public interface IExecutiveAuthService
{
    Task<ExecutiveLoginResponseDto?> Login(ExecutiveLoginRequestDto dto);
}
