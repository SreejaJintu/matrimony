using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Masters;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class MasterRepository : IMasterRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public MasterRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<MasterDto>> GetReligion()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetReligion",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetHeight()
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryAsync<MasterDto>(
            "usp_Master_GetHeight",
            commandType: System.Data.CommandType.StoredProcedure);
        
        var resultList = result.ToList();
        Console.WriteLine($"[DEBUG] GetHeight returned {resultList.Count} items");
        foreach (var item in resultList)
        {
            Console.WriteLine($"[DEBUG] Height item - Id: {item.Id}, Name: '{item.Name}'");
        }
        
        return resultList;
    }

    public async Task<IEnumerable<MasterDto>> GetCommunity(int religionId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetCommunity",
            new { ReligionId = religionId },
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetCountry()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetCountry",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetState(int countryId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetState",
            new { CountryId = countryId },
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetDistrict(int stateId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetDistrict",
            new { StateId = stateId },
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetAllDistricts()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            """
            SELECT DistrictId AS Id, DistrictName AS Name
            FROM DistrictMaster
            ORDER BY DistrictName;
            """);
    }

    public async Task<IEnumerable<MasterDto>> GetEducation()
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryAsync<MasterDto>(
            "usp_Master_GetEducation",
            commandType: System.Data.CommandType.StoredProcedure);
        
        var resultList = result.ToList();
        Console.WriteLine($"[DEBUG] GetEducation returned {resultList.Count} items");
        foreach (var item in resultList)
        {
            Console.WriteLine($"[DEBUG] Education item - Id: {item.Id}, Name: '{item.Name}'");
        }
        
        return resultList;
    }

    public async Task<IEnumerable<MasterDto>> GetMaritalStatus()
    {
        using var connection = _connectionFactory.CreateConnection();
        var result = await connection.QueryAsync<MasterDto>(
            "usp_Master_GetMaritalStatus",
            commandType: System.Data.CommandType.StoredProcedure);
        
        var resultList = result.ToList();
        Console.WriteLine($"[DEBUG] GetMaritalStatus returned {resultList.Count} items");
        foreach (var item in resultList)
        {
            Console.WriteLine($"[DEBUG] MaritalStatus item - Id: {item.Id}, Name: '{item.Name}'");
        }
        
        return resultList;
    }

    public async Task<IEnumerable<MasterDto>> GetMotherTongue()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetMotherTongue",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetOccupation()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetOccupation",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetIncome()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetIncome",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetFamilyType()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetFamilyType",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetFamilyStatus()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetFamilyStatus",
            commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<MasterDto>> GetFamilyValue()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<MasterDto>(
            "usp_Master_GetFamilyValue",
            commandType: System.Data.CommandType.StoredProcedure);
    }
}
