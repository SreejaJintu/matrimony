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
        var admin = await _adminAuthRepository.Login(dto.UserName.Trim());

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

    public async Task<(bool Success, string Message)> UpdateCredentials(int adminId, string currentPassword, string userName, string? email, string? newPassword)
    {
        var admin = await _adminAuthRepository.GetById(adminId);
        if (admin is null || !admin.IsActive || !PasswordHelper.Verify(currentPassword, admin.PasswordHash))
            return (false, "Current password is incorrect.");

        var result = await _adminAuthRepository.UpdateCredentials(
            adminId,
            userName.Trim(),
            string.IsNullOrWhiteSpace(email) ? null : email.Trim(),
            string.IsNullOrWhiteSpace(newPassword) ? null : PasswordHelper.Hash(newPassword));

        return result switch
        {
            1 => (true, "Admin credentials updated successfully."),
            2 => (false, "That username is already in use."),
            _ => (false, "Active Admin account not found.")
        };
    }

    public async Task<IReadOnlyList<AdminAccountSummary>?> GetActiveAdminsForSuperAdmin(int actorAdminId)
    {
        if (!await _adminAuthRepository.IsActiveSuperAdmin(actorAdminId)) return null;
        return await _adminAuthRepository.GetActiveAdmins();
    }

    public async Task<bool> ResetAdminPassword(int actorAdminId, int targetAdminId, string newPassword)
    {
        if (actorAdminId == targetAdminId || !await _adminAuthRepository.IsActiveSuperAdmin(actorAdminId)) return false;
        return await _adminAuthRepository.ResetPassword(targetAdminId, PasswordHelper.Hash(newPassword));
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
