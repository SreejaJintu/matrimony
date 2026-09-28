using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Authentication;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SoeasyWebsite.Server.Helpers;

namespace SoeasyWebsite.Server.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
private readonly JwtSettings _jwtSettings;
private readonly ISmsBitsService _smsBitsService;

public AuthService(
    IAuthRepository authRepository,
    IOptions<JwtSettings> jwtSettings,
    ISmsBitsService smsBitsService)
{
    _authRepository = authRepository;
    _jwtSettings = jwtSettings.Value;
    _smsBitsService = smsBitsService;
}

    public async Task<ApiResponse<RegisterResponseDto>> Register(RegisterRequestDto dto)
    {
        var userId = await _authRepository.Register(dto);

        if (userId <= 0)
        {
            return new ApiResponse<RegisterResponseDto>
            {
                Success = false,
                Message = "Registration failed. Mobile number or email may already exist.",
                Data = new RegisterResponseDto
                {
                    Success = false,
                    Message = "Registration failed."
                }
            };
        }

        return new ApiResponse<RegisterResponseDto>
        {
            Success = true,
            Message = "Registration successful.",
            Data = new RegisterResponseDto
            {
                Success = true,
                Message = "Registration successful.",
                UserId = userId,
                ProfileCode = $"SM{userId:000000}"
            }
        };
    }

    public async Task<ApiResponse<LoginResponseDto>> Login(LoginRequestDto dto)
    {
        var user = await _authRepository.Login(dto);

        if (user is null)
        {
            return new ApiResponse<LoginResponseDto>
            {
                Success = false,
                Message = "Invalid username or password."
            };
        }

        // =========================================================
        // APPROVED BROKER
        // =========================================================
        // Approved brokers bypass OTP and receive JWT immediately.
        if (user.IsBroker)
        {
            user.Token = GenerateToken(
                user.UserId,
                user.FullName,
                true);

            user.RequiresOtp = false;
            user.Message = "Login successful.";

            return new ApiResponse<LoginResponseDto>
            {
                Success = true,
                Message = "Login successful.",
                Data = user
            };
        }

        // =========================================================
        // NORMAL MEMBER
        // =========================================================
        // Members must verify OTP on every login.

        if (string.IsNullOrWhiteSpace(user.MobileNumber))
        {
            return new ApiResponse<LoginResponseDto>
            {
                Success = false,
                Message = "No registered mobile number is available for OTP verification."
            };
        }

        // Generate a 6-digit OTP
        var otp = Random.Shared.Next(100000, 1000000).ToString();

        // Hash OTP using BCrypt before storing it
        var otpHash = PasswordHelper.Hash(otp);

        // OTP valid for 3 minutes
        var expiresAt = DateTime.Now.AddMinutes(3);

        await _authRepository.CreateLoginOtp(
            user.UserId,
            user.MobileNumber,
            otpHash,
            expiresAt);

        // Send OTP to registered mobile number
        var smsResult = await _smsBitsService.SendOtpAsync(
            user.MobileNumber,
            otp);

        if (!smsResult.Success)
        {
            return new ApiResponse<LoginResponseDto>
            {
                Success = false,
                Message = $"OTP could not be sent. SMS BITS response: {smsResult.Response}"
            };
        }

        // Do NOT generate JWT yet.
        user.Token = string.Empty;
        user.RequiresOtp = true;
        user.Message = "OTP sent successfully.";

        return new ApiResponse<LoginResponseDto>
        {
            Success = true,
            Message = "OTP sent successfully.",
            Data = user
        };
    }

    private string GenerateToken(
        int userId,
        string fullName,
        bool isBroker)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var userType = isBroker ? "Broker" : "Member";

        var claims = new[]
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                userId.ToString()),

            new Claim(
                JwtRegisteredClaimNames.Name,
                fullName),

            new Claim(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()),

            // Broker / Member identification
            new Claim("userType", userType)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _jwtSettings.DurationInMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
public async Task<ApiResponse<VerifyOtpResponseDto>> VerifyLoginOtp(
    VerifyLoginOtpRequestDto dto)
{
    if (dto.UserId <= 0)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "Invalid user."
        };
    }

    if (string.IsNullOrWhiteSpace(dto.Otp))
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "OTP is required."
        };
    }

    var otpRecord = await _authRepository.GetLatestLoginOtp(dto.UserId);

    if (otpRecord is null)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "OTP not found."
        };
    }

    if (otpRecord.IsUsed)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "OTP has already been used or replaced."
        };
    }

    if (otpRecord.ExpiresAt <= DateTime.Now)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "OTP has expired."
        };
    }

    if (otpRecord.Attempts >= 5)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "Too many incorrect OTP attempts."
        };
    }

    // Verify the OTP using BCrypt, just like passwords.
    var isValidOtp = PasswordHelper.Verify(
        dto.Otp.Trim(),
        otpRecord.OtpHash);

    if (!isValidOtp)
    {
        await _authRepository.IncrementLoginOtpAttempts(
            otpRecord.OtpId);

        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "Invalid OTP."
        };
    }

    // OTP is correct. Mark it as used before issuing the JWT.
    var markedUsed = await _authRepository.MarkLoginOtpUsed(
        otpRecord.OtpId);

    if (!markedUsed)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "OTP could not be completed. Please request a new OTP."
        };
    }

    // Get the user's login information so we can create the JWT.
    var loginUser = await _authRepository.GetUserForOtpLogin(dto.UserId);

    if (loginUser is null)
    {
        return new ApiResponse<VerifyOtpResponseDto>
        {
            Success = false,
            Message = "User account not found."
        };
    }

    var token = GenerateToken(
        loginUser.UserId,
        loginUser.FullName,
        false);

    return new ApiResponse<VerifyOtpResponseDto>
    {
        Success = true,
        Message = "OTP verified successfully.",
        Data = new VerifyOtpResponseDto
        {
            UserId = loginUser.UserId,
            FullName = loginUser.FullName,
            GenderId = loginUser.GenderId,
            Token = token,
            Message = "Login successful."
        }
    };
}
}