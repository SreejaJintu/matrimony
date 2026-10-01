using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SoeasyWebsite.Server.DTOs.Executive;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SoeasyWebsite.Server.Services;

public class ExecutiveAuthService : IExecutiveAuthService
{
    private readonly IExecutiveAuthRepository _repository;
    private readonly JwtSettings _jwtSettings;

    public ExecutiveAuthService(IExecutiveAuthRepository repository, IOptions<JwtSettings> jwtSettings)
    {
        _repository = repository;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<ExecutiveLoginResponseDto?> Login(ExecutiveLoginRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrEmpty(dto.Password))
            return null;

        var executive = await _repository.Login(dto.UserName.Trim());
        if (executive is null || !executive.IsActive ||
            !PasswordHelper.Verify(dto.Password, executive.PasswordHash))
            return null;

        return new ExecutiveLoginResponseDto
        {
            ExecutiveId = executive.ExecutiveId,
            FullName = executive.FullName,
            UserName = executive.UserName,
            Email = executive.Email,
            MobileNumber = executive.MobileNumber,
            IsActive = executive.IsActive,
            Token = GenerateToken(executive)
        };
    }

    private string GenerateToken(ExecutiveLoginModel executive)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, executive.ExecutiveId.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, executive.FullName),
            new Claim("executiveId", executive.ExecutiveId.ToString()),
            new Claim("userType", "Executive"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
