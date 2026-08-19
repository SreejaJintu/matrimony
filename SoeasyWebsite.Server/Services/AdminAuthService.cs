using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SoeasyWebsite.Server.Services;

public class AdminAuthService : IAdminAuthService
{
    private readonly IAdminAuthRepository _adminAuthRepository;
    private readonly JwtSettings _jwtSettings;

    public AdminAuthService(
        IAdminAuthRepository adminAuthRepository,
        IOptions<JwtSettings> jwtSettings)
    {
        _adminAuthRepository = adminAuthRepository;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AdminLoginResponseDto?> Login(
        AdminLoginRequestDto dto)
    {
        // Get admin from database
        var admin = await _adminAuthRepository.Login(dto.UserName);

        if (admin is null)
        {
            return null;
        }

        // Verify password
        if (!PasswordHelper.Verify(
                dto.Password,
                admin.PasswordHash))
        {
            return null;
        }

        // Generate JWT
        var token = GenerateToken(admin);

        return new AdminLoginResponseDto
        {
            AdminId = admin.AdminId,
            FullName = admin.FullName,
            UserName = admin.UserName,
            Email = admin.Email,
            MobileNumber = admin.MobileNumber,
            IsSuperAdmin = admin.IsSuperAdmin,
            Token = token
        };
    }

    private string GenerateToken(AdminUserLoginModel admin)
    {
        var claims = new[]
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                admin.AdminId.ToString()
            ),

            new Claim(
                JwtRegisteredClaimNames.Name,
                admin.FullName
            ),

            new Claim(
                "adminId",
                admin.AdminId.ToString()
            ),

            new Claim(
                "isSuperAdmin",
                admin.IsSuperAdmin.ToString()
            ),

            new Claim(
                "userType",
                "Admin"
            ),

            new Claim(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _jwtSettings.DurationInMinutes
            ),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}