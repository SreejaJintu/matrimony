using System.Data;
using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AdminExecutiveRepository : IAdminExecutiveRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminExecutiveRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<ExecutiveDto>> GetAllAsync(string? search, bool? isActive)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ExecutiveDto>(
            "usp_Admin_Executive_GetAll",
            new { Search = search, IsActive = isActive },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ExecutiveDto?> GetByIdAsync(int executiveId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<ExecutiveDto>(
            "usp_Admin_Executive_GetById",
            new { ExecutiveId = executiveId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ExecutiveOperationResultDto> CreateAsync(
        CreateExecutiveRequestDto request,
        string passwordHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleAsync<ExecutiveOperationResultDto>(
            "usp_Admin_Executive_Create",
            new
            {
                request.FullName,
                request.UserName,
                request.Email,
                request.MobileNumber,
                PasswordHash = passwordHash,
                request.IsActive
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ExecutiveOperationResultDto> UpdateAsync(
        int executiveId,
        UpdateExecutiveRequestDto request)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleAsync<ExecutiveOperationResultDto>(
            "usp_Admin_Executive_Update",
            new
            {
                ExecutiveId = executiveId,
                request.FullName,
                request.UserName,
                request.Email,
                request.MobileNumber
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> UpdateStatusAsync(int executiveId, bool isActive)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleAsync<bool>(
            "usp_Admin_Executive_UpdateStatus",
            new { ExecutiveId = executiveId, IsActive = isActive },
            commandType: CommandType.StoredProcedure);
    }
}