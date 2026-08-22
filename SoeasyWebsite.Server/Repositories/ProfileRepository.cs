using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Profile;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly IDbConnectionFactory _connectionFactory;
    private readonly ILogger<ProfileRepository> _logger;

    public ProfileRepository(IDbConnectionFactory connectionFactory, ILogger<ProfileRepository> logger)
    {
        _connectionFactory = connectionFactory;
        _logger = logger;
    }

    public async Task<UserProfileDto?> GetByUserId(int userId, int? viewerUserId = null)
    {
        using var connection = _connectionFactory.CreateConnection();

        bool isOwnProfile = viewerUserId.HasValue && viewerUserId.Value == userId;
        bool isPaidMember = false;

        if (viewerUserId.HasValue && !isOwnProfile)
        {
            const string membershipSql = """
                SELECT CASE 
                    WHEN ua.IsPremium = 1 OR ua.MembershipPlanId > 1 THEN 1
                    WHEN EXISTS (
                        SELECT 1 FROM UserSubscription us 
                        WHERE us.UserId = @ViewerUserId 
                          AND us.IsActive = 1 
                          AND us.EndDate >= CAST(GETDATE() AS DATE)
                    ) THEN 1
                    ELSE 0 
                END
                FROM UserAccount ua
                WHERE ua.UserId = @ViewerUserId AND ua.IsActive = 1;
            """;
            isPaidMember = await connection.ExecuteScalarAsync<bool>(membershipSql, new { ViewerUserId = viewerUserId.Value });
        }

        bool hasFullAccess = isOwnProfile || isPaidMember;

        const string sql = """
            SELECT
                ua.UserId,
                ua.ProfileCode,
                ua.FullName,
                ua.MobileNumber,
                ua.Email,
                ua.GenderId,
                photo.PhotoUrl AS ImageUrl,
                up.DateOfBirth,
                up.HeightId,
                hm.HeightValue AS Height,
                up.Weight,
                up.MaritalStatusId,
                ms.MaritalStatusName AS MaritalStatus,
                up.MotherTongueId,
                mt.MotherTongueName AS MotherTongue,
                up.ReligionId,
                rm.ReligionName AS Religion,
                up.CommunityId,
                cm.CommunityName AS Community,
                up.EducationId,
                edm.EducationName AS Education,
                up.OccupationId,
                om.OccupationName AS Occupation,
                up.CompanyName,
                up.Designation,
                up.IncomeId,
                im.IncomeRange AS Income,
                up.CountryId,
                ctry.CountryName AS Country,
                up.StateId,
                sm.StateName AS State,
                up.DistrictId,
                dm.DistrictName AS District,
                up.Address,
                up.Pincode,
                up.AboutMe,
                uf.FatherName,
                uf.MotherName,
                uf.FamilyTypeId,
                ft.FamilyTypeName AS FamilyType,
                uf.FamilyStatusId,
                fs.FamilyStatusName AS FamilyStatus,
                uf.FamilyValueId,
                fv.FamilyValueName AS FamilyValue,
                uf.NativePlace,
                ISNULL(uf.Brothers, 0) AS Brothers,
                ISNULL(uf.MarriedBrothers, 0) AS MarriedBrothers,
                ISNULL(uf.Sisters, 0) AS Sisters,
                ISNULL(uf.MarriedSisters, 0) AS MarriedSisters,
                uf.AboutFamily AS FamilyAbout,
                pref.PreferredDescription,
                pref.AgeFrom,
                pref.AgeTo,
                hfrom.HeightValue AS HeightFrom,
                hto.HeightValue AS HeightTo,
                prm.ReligionName AS PreferredReligion,
                pcm.CommunityName AS PreferredCommunity,
                ped.EducationName AS PreferredEducation,
                pom.OccupationName AS PreferredOccupation,
                pin.IncomeRange AS PreferredIncome
            FROM UserAccount ua
            LEFT JOIN UserProfile up ON up.UserId = ua.UserId AND up.IsActive = 1
            LEFT JOIN UserPhoto photo ON photo.UserId = ua.UserId AND photo.IsProfilePhoto = 1 AND photo.IsActive = 1
            LEFT JOIN HeightMaster hm ON hm.HeightId = up.HeightId
            LEFT JOIN MaritalStatusMaster ms ON ms.MaritalStatusId = up.MaritalStatusId
            LEFT JOIN MotherTongueMaster mt ON mt.MotherTongueId = up.MotherTongueId
            LEFT JOIN ReligionMaster rm ON rm.ReligionId = up.ReligionId
            LEFT JOIN CommunityMaster cm ON cm.CommunityId = up.CommunityId
            LEFT JOIN EducationMaster edm ON edm.EducationId = up.EducationId
            LEFT JOIN OccupationMaster om ON om.OccupationId = up.OccupationId
            LEFT JOIN IncomeMaster im ON im.IncomeId = up.IncomeId
            LEFT JOIN CountryMaster ctry ON ctry.CountryId = up.CountryId
            LEFT JOIN StateMaster sm ON sm.StateId = up.StateId
            LEFT JOIN DistrictMaster dm ON dm.DistrictId = up.DistrictId
            LEFT JOIN UserFamily uf ON uf.UserId = ua.UserId AND uf.IsActive = 1
            LEFT JOIN FamilyTypeMaster ft ON ft.FamilyTypeId = uf.FamilyTypeId
            LEFT JOIN FamilyStatusMaster fs ON fs.FamilyStatusId = uf.FamilyStatusId
            LEFT JOIN FamilyValueMaster fv ON fv.FamilyValueId = uf.FamilyValueId
            LEFT JOIN UserPreference pref ON pref.UserId = ua.UserId AND pref.IsActive = 1
            LEFT JOIN HeightMaster hfrom ON hfrom.HeightId = pref.HeightFromId
            LEFT JOIN HeightMaster hto ON hto.HeightId = pref.HeightToId
            LEFT JOIN ReligionMaster prm ON prm.ReligionId = pref.ReligionId
            LEFT JOIN CommunityMaster pcm ON pcm.CommunityId = pref.CommunityId
            LEFT JOIN EducationMaster ped ON ped.EducationId = pref.EducationId
            LEFT JOIN OccupationMaster pom ON pom.OccupationId = pref.OccupationId
            LEFT JOIN IncomeMaster pin ON pin.IncomeId = pref.IncomeId
            WHERE ua.UserId = @UserId
              AND ua.IsActive = 1;
            """;

        var profile = await connection.QueryFirstOrDefaultAsync<UserProfileDto>(sql, new { UserId = userId });
        if (profile is null) return null;

        profile.CanViewFullProfile = hasFullAccess;
        profile.IsLocked = !hasFullAccess;

        if (!hasFullAccess)
        {
            // Protect private contact/address details at backend level
            profile.MobileNumber = null;
            profile.Email = null;
            profile.Address = null;
            profile.Pincode = null;
        }

        return profile;
    }

    public async Task<bool> UpsertProfile(UpsertProfileRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        _logger.LogInformation(
            "ProfileRepository.UpsertProfile running in Database={Database} for UserId={UserId}",
            connection.Database,
            dto.UserId);

        try
        {
            var parameters = new DynamicParameters(dto);
            parameters.Add(
                "DateOfBirth",
                dto.DateOfBirth.HasValue ? dto.DateOfBirth.Value : DBNull.Value,
                DbType.DateTime);

            using var grid = await connection.QueryMultipleAsync(
                "usp_Profile_Upsert",
                parameters,
                commandType: CommandType.StoredProcedure);

            var debugInfo = await grid.ReadFirstOrDefaultAsync<ProfileUpsertDebugRow>();
            var resultInfo = await grid.ReadFirstOrDefaultAsync<ProfileUpsertResultRow>();

            _logger.LogInformation(
                "usp_Profile_Upsert debug Database={Database}, UserId={DebugUserId}, Success={Success}, Message={Message}, RowsUpdated={RowsUpdated}",
                debugInfo?.CurrentDatabase,
                debugInfo?.DebugUserId,
                resultInfo?.Success,
                resultInfo?.Message,
                resultInfo?.RowsUpdated);

            return resultInfo?.Success ?? true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ProfileRepository.UpsertProfile failed for UserId={UserId}", dto.UserId);
            throw;
        }
    }

    public async Task<bool> UpsertFamily(UpsertFamilyRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            IF EXISTS (SELECT 1 FROM UserFamily WHERE UserId = @UserId)
            BEGIN
                UPDATE UserFamily
                SET FatherName = @FatherName,
                    FatherOccupationId = @FatherOccupationId,
                    MotherName = @MotherName,
                    MotherOccupationId = @MotherOccupationId,
                    FamilyTypeId = @FamilyTypeId,
                    FamilyStatusId = @FamilyStatusId,
                    FamilyValueId = @FamilyValueId,
                    NativePlace = @NativePlace,
                    Brothers = @Brothers,
                    MarriedBrothers = @MarriedBrothers,
                    Sisters = @Sisters,
                    MarriedSisters = @MarriedSisters,
                    AboutFamily = @AboutFamily,
                    UpdatedAt = GETDATE()
                WHERE UserId = @UserId;
            END
            ELSE
            BEGIN
                INSERT INTO UserFamily
                (
                    UserId, FatherName, FatherOccupationId, MotherName, MotherOccupationId,
                    FamilyTypeId, FamilyStatusId, FamilyValueId, NativePlace, Brothers,
                    MarriedBrothers, Sisters, MarriedSisters, AboutFamily, CreatedAt, IsActive
                )
                VALUES
                (
                    @UserId, @FatherName, @FatherOccupationId, @MotherName, @MotherOccupationId,
                    @FamilyTypeId, @FamilyStatusId, @FamilyValueId, @NativePlace, @Brothers,
                    @MarriedBrothers, @Sisters, @MarriedSisters, @AboutFamily, GETDATE(), 1
                );
            END
            """;

        return await connection.ExecuteAsync(sql, dto) > 0;
    }

    public async Task<bool> UpsertPreference(UpsertPreferenceRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            IF EXISTS (SELECT 1 FROM UserPreference WHERE UserId = @UserId)
            BEGIN
                UPDATE UserPreference
                SET AgeFrom = @AgeFrom,
                    AgeTo = @AgeTo,
                    HeightFromId = @HeightFromId,
                    HeightToId = @HeightToId,
                    MaritalStatusId = @MaritalStatusId,
                    ReligionId = @ReligionId,
                    CommunityId = @CommunityId,
                    MotherTongueId = @MotherTongueId,
                    EducationId = @EducationId,
                    OccupationId = @OccupationId,
                    IncomeId = @IncomeId,
                    CountryId = @CountryId,
                    StateId = @StateId,
                    DistrictId = @DistrictId,
                    PreferredDescription = @PreferredDescription,
                    UpdatedAt = GETDATE()
                WHERE UserId = @UserId;
            END
            ELSE
            BEGIN
                INSERT INTO UserPreference
                (
                    UserId, AgeFrom, AgeTo, HeightFromId, HeightToId, MaritalStatusId,
                    ReligionId, CommunityId, MotherTongueId, EducationId, OccupationId,
                    IncomeId, CountryId, StateId, DistrictId, PreferredDescription, CreatedAt, IsActive
                )
                VALUES
                (
                    @UserId, @AgeFrom, @AgeTo, @HeightFromId, @HeightToId, @MaritalStatusId,
                    @ReligionId, @CommunityId, @MotherTongueId, @EducationId, @OccupationId,
                    @IncomeId, @CountryId, @StateId, @DistrictId, @PreferredDescription, GETDATE(), 1
                );
            END
            """;

        return await connection.ExecuteAsync(sql, dto) > 0;
    }

    public async Task<bool> SavePhoto(SaveUserPhotoRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        if (dto.IsProfilePhoto)
        {
            await connection.ExecuteAsync(
                "UPDATE UserPhoto SET IsProfilePhoto = 0 WHERE UserId = @UserId AND IsProfilePhoto = 1;",
                new { dto.UserId });
        }

        const string sql = """
            INSERT INTO UserPhoto
            (
                UserId,
                PhotoUrl,
                IsProfilePhoto,
                DisplayOrder,
                IsApproved,
                CreatedAt,
                IsActive
            )
            VALUES
            (
                @UserId,
                @PhotoUrl,
                @IsProfilePhoto,
                @DisplayOrder,
                @IsApproved,
                GETDATE(),
                1
            );
            """;

        return await connection.ExecuteAsync(sql, dto) > 0;
    }

    private sealed class ProfileUpsertDebugRow
    {
        public string? CurrentDatabase { get; set; }
        public int DebugUserId { get; set; }
    }

    private sealed class ProfileUpsertResultRow
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public int RowsUpdated { get; set; }
    }
}
