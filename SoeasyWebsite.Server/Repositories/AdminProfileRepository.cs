using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class AdminProfileRepository : IAdminProfileRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminProfileRepository(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<AdminProfileDto>> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId)
    {
        using var connection =
            _connectionFactory.CreateConnection();

        var result =
            await connection.QueryAsync<AdminProfileDto>(
                "usp_Admin_Profile_GetAll",
                new
                {
                    Search = search,
                    GenderId = genderId,
                    ProfileStatusId = profileStatusId
                },
                commandType: CommandType.StoredProcedure
            );

        return result;
    }
}