using SoeasyWebsite.Server.DTOs.Authentication;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAuthRepository
{
    Task<LoginResponseDto?> Login(LoginRequestDto dto);

    Task<int> Register(RegisterRequestDto dto);
}