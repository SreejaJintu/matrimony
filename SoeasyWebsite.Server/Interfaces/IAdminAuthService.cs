using SoeasyWebsite.Server.DTOs.Admin;

namespace SoeasyWebsite.Server.Interfaces;

public interface IAdminAuthService
{
    Task<AdminLoginResponseDto?> Login(
        AdminLoginRequestDto dto);
}