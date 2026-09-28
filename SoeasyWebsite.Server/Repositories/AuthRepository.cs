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

        if (string.IsNullOrWhiteSpace(passwordHash) ||
            !PasswordHelper.Verify(dto.Password, passwordHash))
        {
            return null;
        }

        return new LoginResponseDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            MobileNumber = user.MobileNumber,
            GenderId = user.GenderId,
            IsBroker = user.IsApprovedBroker
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


    public async Task<int> CreateLoginOtp(
    int userId,
    string mobileNumber,
    string otpHash,
    DateTime expiresAt)
{
    using var connection = _connectionFactory.CreateConnection();

    // Invalidate previous unused OTPs
    await connection.ExecuteAsync(
        @"UPDATE dbo.UserLoginOtp
          SET IsUsed = 1
          WHERE UserId = @UserId
            AND IsUsed = 0;",
        new { UserId = userId });

    // Insert new OTP
    var otpId = await connection.QuerySingleAsync<int>(
        @"INSERT INTO dbo.UserLoginOtp
          (
              UserId,
              MobileNumber,
              OtpHash,
              ExpiresAt,
              Attempts,
              IsUsed
          )
          OUTPUT INSERTED.OtpId
          VALUES
          (
              @UserId,
              @MobileNumber,
              @OtpHash,
              @ExpiresAt,
              0,
              0
          );",
        new
        {
            UserId = userId,
            MobileNumber = mobileNumber,
            OtpHash = otpHash,
            ExpiresAt = expiresAt
        });

    return otpId;
}

public async Task<LoginOtpRecord?> GetLatestLoginOtp(int userId)
{
    using var connection = _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<LoginOtpRecord>(
        @"SELECT TOP 1
              OtpId,
              UserId,
              MobileNumber,
              OtpHash,
              ExpiresAt,
              Attempts,
              IsUsed
          FROM dbo.UserLoginOtp
          WHERE UserId = @UserId
          ORDER BY CreatedAt DESC, OtpId DESC;",
        new { UserId = userId });
}

public async Task<bool> MarkLoginOtpUsed(int otpId)
{
    using var connection = _connectionFactory.CreateConnection();

    var rows = await connection.ExecuteAsync(
        @"UPDATE dbo.UserLoginOtp
          SET IsUsed = 1
          WHERE OtpId = @OtpId
            AND IsUsed = 0;",
        new { OtpId = otpId });

    return rows > 0;
}

public async Task<bool> IncrementLoginOtpAttempts(int otpId)
{
    using var connection = _connectionFactory.CreateConnection();

    var rows = await connection.ExecuteAsync(
        @"UPDATE dbo.UserLoginOtp
          SET Attempts = Attempts + 1
          WHERE OtpId = @OtpId
            AND IsUsed = 0
            AND Attempts < 5;",
        new { OtpId = otpId });

    return rows > 0;
}

public async Task<LoginResponseDto?> GetUserForOtpLogin(int userId)
{
    using var connection = _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<LoginResponseDto>(
        @"SELECT
              UserId,
              FullName,
              GenderId
          FROM dbo.UserAccount
          WHERE UserId = @UserId
            AND IsActive = 1;",
        new { UserId = userId });
}
}