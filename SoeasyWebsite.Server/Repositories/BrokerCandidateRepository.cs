using System.Data;
using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Broker;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class BrokerCandidateRepository : IBrokerCandidateRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public BrokerCandidateRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<BrokerCandidateDto>> GetAllAsync(int brokerId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            SELECT
                ua.UserId,
                ua.ProfileCode,
                ua.FullName,
                ua.GenderId,
                g.GenderName AS Gender,
                ua.MobileNumber,
                ua.Email,
                ua.ProfileStatusId,
                ps.StatusName AS ProfileStatus,
                ua.IsProfileCompleted,
                ua.IsPremium,
                ua.CreatedAt
            FROM dbo.UserAccount ua
            LEFT JOIN dbo.GenderMaster g ON g.GenderId = ua.GenderId
            LEFT JOIN dbo.ProfileStatusMaster ps ON ps.ProfileStatusId = ua.ProfileStatusId
            WHERE ua.BrokerId = @BrokerId
            ORDER BY ua.CreatedAt DESC, ua.UserId DESC;
            """;

        return await connection.QueryAsync<BrokerCandidateDto>(sql, new { BrokerId = brokerId });
    }

    public async Task<BrokerCandidateDto?> GetByUserIdAsync(int brokerId, int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            SELECT
                ua.UserId,
                ua.ProfileCode,
                ua.FullName,
                ua.GenderId,
                g.GenderName AS Gender,
                ua.MobileNumber,
                ua.Email,
                ua.ProfileStatusId,
                ps.StatusName AS ProfileStatus,
                ua.IsProfileCompleted,
                ua.IsPremium,
                ua.CreatedAt
            FROM dbo.UserAccount ua
            LEFT JOIN dbo.GenderMaster g ON g.GenderId = ua.GenderId
            LEFT JOIN dbo.ProfileStatusMaster ps ON ps.ProfileStatusId = ua.ProfileStatusId
            WHERE ua.BrokerId = @BrokerId
              AND ua.UserId = @UserId;
            """;

        return await connection.QuerySingleOrDefaultAsync<BrokerCandidateDto>(
            sql,
            new { BrokerId = brokerId, UserId = userId });
    }

    public async Task<CreateBrokerCandidateResponseDto?> CreateAsync(
        CreateBrokerCandidateRequestDto request,
        int brokerId,
        string passwordHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("BrokerId", brokerId, DbType.Int32);
        parameters.Add("FullName", request.FullName.Trim(), DbType.String, size: 150);
        parameters.Add("MobileNumber", request.MobileNumber.Trim(), DbType.AnsiString, size: 15);
        parameters.Add("Email", request.Email?.Trim(), DbType.String, size: 150);
        parameters.Add("PasswordHash", passwordHash, DbType.String, size: 500);
        parameters.Add("GenderId", request.GenderId, DbType.Byte);

        AddProfileParameters(parameters, request.Profile);
        AddFamilyParameters(parameters, request.Family);
        AddPreferenceParameters(parameters, request.Preference);

        parameters.Add("PhotosJson", System.Text.Json.JsonSerializer.Serialize(request.Photos));

        return await connection.QuerySingleOrDefaultAsync<CreateBrokerCandidateResponseDto>(
            "dbo.usp_Broker_Candidate_Create",
            parameters,
            commandType: CommandType.StoredProcedure);
    }

    private static void AddProfileParameters(DynamicParameters parameters, SoeasyWebsite.Server.DTOs.Profile.UpsertProfileRequestDto? p)
    {
        parameters.Add("DateOfBirth", p?.DateOfBirth?.Date, DbType.Date);
        parameters.Add("HeightId", p?.HeightId, DbType.Int16);
        parameters.Add("Weight", p?.Weight, DbType.Decimal);
        parameters.Add("MaritalStatusId", p?.MaritalStatusId, DbType.Byte);
        parameters.Add("MotherTongueId", p?.MotherTongueId, DbType.Int16);
        parameters.Add("ReligionId", p?.ReligionId, DbType.Int16);
        parameters.Add("CommunityId", p?.CommunityId, DbType.Int32);
        parameters.Add("EducationId", p?.EducationId, DbType.Int16);
        parameters.Add("OccupationId", p?.OccupationId, DbType.Int16);
        parameters.Add("CompanyName", p?.CompanyName, DbType.String, size: 150);
        parameters.Add("Designation", p?.Designation, DbType.String, size: 150);
        parameters.Add("IncomeId", p?.IncomeId, DbType.Int16);
        parameters.Add("CountryId", p?.CountryId, DbType.Int16);
        parameters.Add("StateId", p?.StateId, DbType.Int16);
        parameters.Add("DistrictId", p?.DistrictId, DbType.Int16);
        parameters.Add("Address", p?.Address, DbType.String, size: 500);
        parameters.Add("Pincode", p?.Pincode, DbType.AnsiString, size: 15);
        parameters.Add("AboutMe", p?.AboutMe, DbType.String);
    }

    private static void AddFamilyParameters(DynamicParameters parameters, SoeasyWebsite.Server.DTOs.Profile.UpsertFamilyRequestDto? f)
    {
        parameters.Add("FatherName", f?.FatherName, DbType.String, size: 150);
        parameters.Add("FatherOccupationId", f?.FatherOccupationId, DbType.Int16);
        parameters.Add("MotherName", f?.MotherName, DbType.String, size: 150);
        parameters.Add("MotherOccupationId", f?.MotherOccupationId, DbType.Int16);
        parameters.Add("FamilyTypeId", f?.FamilyTypeId, DbType.Byte);
        parameters.Add("FamilyStatusId", f?.FamilyStatusId, DbType.Byte);
        parameters.Add("FamilyValueId", f?.FamilyValueId, DbType.Byte);
        parameters.Add("NativePlace", f?.NativePlace, DbType.String, size: 150);
        parameters.Add("Brothers", f?.Brothers ?? 0, DbType.Byte);
        parameters.Add("MarriedBrothers", f?.MarriedBrothers ?? 0, DbType.Byte);
        parameters.Add("Sisters", f?.Sisters ?? 0, DbType.Byte);
        parameters.Add("MarriedSisters", f?.MarriedSisters ?? 0, DbType.Byte);
        parameters.Add("AboutFamily", f?.AboutFamily, DbType.String);
    }

    private static void AddPreferenceParameters(DynamicParameters parameters, SoeasyWebsite.Server.DTOs.Profile.UpsertPreferenceRequestDto? p)
    {
        parameters.Add("AgeFrom", p?.AgeFrom, DbType.Byte);
        parameters.Add("AgeTo", p?.AgeTo, DbType.Byte);
        parameters.Add("HeightFromId", p?.HeightFromId, DbType.Int16);
        parameters.Add("HeightToId", p?.HeightToId, DbType.Int16);
        parameters.Add("PreferredMaritalStatusId", p?.MaritalStatusId, DbType.Byte);
        parameters.Add("PreferredReligionId", p?.ReligionId, DbType.Int16);
        parameters.Add("PreferredCommunityId", p?.CommunityId, DbType.Int32);
        parameters.Add("PreferredMotherTongueId", p?.MotherTongueId, DbType.Int16);
        parameters.Add("PreferredEducationId", p?.EducationId, DbType.Int16);
        parameters.Add("PreferredOccupationId", p?.OccupationId, DbType.Int16);
        parameters.Add("PreferredIncomeId", p?.IncomeId, DbType.Int16);
        parameters.Add("PreferredCountryId", p?.CountryId, DbType.Int16);
        parameters.Add("PreferredStateId", p?.StateId, DbType.Int16);
        parameters.Add("PreferredDistrictId", p?.DistrictId, DbType.Int16);
        parameters.Add("PreferredDescription", p?.PreferredDescription, DbType.String);
    }
}
