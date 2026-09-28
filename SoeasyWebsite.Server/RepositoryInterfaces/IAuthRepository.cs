using SoeasyWebsite.Server.DTOs.Authentication;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IAuthRepository
{
    Task<LoginResponseDto?> Login(LoginRequestDto dto);

    Task<int> Register(RegisterRequestDto dto);

    Task<int> CreateLoginOtp(
        int userId,
        string mobileNumber,
        string otpHash,
        DateTime expiresAt);

    Task<LoginOtpRecord?> GetLatestLoginOtp(int userId);

    Task<bool> MarkLoginOtpUsed(int otpId);

    Task<bool> IncrementLoginOtpAttempts(int otpId);

    Task<LoginResponseDto?> GetUserForOtpLogin(int userId);
}