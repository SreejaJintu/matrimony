using System.Data;
using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Location;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public LocationRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<StateDto>> GetStatesByCountry(short countryId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryAsync<StateDto>(
            "usp_Admin_GetStatesByCountry",
            new { CountryId = countryId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<DistrictDto>> GetDistrictsByState(short stateId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryAsync<DistrictDto>(
            "usp_Admin_GetDistrictsByState",
            new { StateId = stateId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<LocationDto>> GetLocationsByDistrict(short districtId)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryAsync<LocationDto>(
            "usp_Admin_GetLocationsByDistrict",
            new { DistrictId = districtId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<LocationOperationResultDto> AddState(AddStateRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<LocationOperationResultDto>(
            "usp_Admin_AddState",
            new
            {
                dto.CountryId,
                dto.StateName
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<LocationOperationResultDto> AddDistrict(AddDistrictRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<LocationOperationResultDto>(
            "usp_Admin_AddDistrict",
            new
            {
                dto.StateId,
                dto.DistrictName
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<LocationOperationResultDto> AddLocation(AddLocationRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        return await connection.QueryFirstAsync<LocationOperationResultDto>(
            "usp_Admin_AddLocation",
            new
            {
                dto.DistrictId,
                dto.LocationName
            },
            commandType: CommandType.StoredProcedure);
    }
}
