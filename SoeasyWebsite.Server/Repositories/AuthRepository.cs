using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Authentication;
using SoeasyWebsite.Server.Helpers;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AuthRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<LoginResponseDto?> Login(LoginRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        var user = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "usp_User_Login",
            new { UserName = dto.UserName.Trim() },
            commandType: System.Data.CommandType.StoredProcedure);

        if (user is null)
        {
            return null;
        }

        var passwordHash = (string?)user.PasswordHash;
        if (string.IsNullOrWhiteSpace(passwordHash) || !PasswordHelper.Verify(dto.Password, passwordHash))
        {
            return null;
        }

        return new LoginResponseDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            GenderId = user.GenderId,
        };
    }

    public async Task<int> Register(RegisterRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "usp_User_Register",
            new
            {
                dto.FullName,
                dto.MobileNumber,
                dto.Email,
                PasswordHash = PasswordHelper.Hash(dto.Password),
                dto.GenderId
            },
            commandType: System.Data.CommandType.StoredProcedure);

        bool? success = (bool?)result?.Success;
        if (success is not true)
        {
            return 0;
        }

        int? userId = (int?)result?.UserId;
        return userId ?? 0;
    }
}
