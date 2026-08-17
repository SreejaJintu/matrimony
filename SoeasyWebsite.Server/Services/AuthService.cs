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

namespace SoeasyWebsite.Server.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IAuthRepository authRepository, IOptions<JwtSettings> jwtSettings)
    {
        _authRepository = authRepository;
        _jwtSettings = jwtSettings.Value;
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

        user.Token = GenerateToken(user.UserId, user.FullName);

        return new ApiResponse<LoginResponseDto>
        {
            Success = true,
            Message = "Login successful.",
            Data = user
        };
    }

    private string GenerateToken(int userId, string fullName)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, fullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
