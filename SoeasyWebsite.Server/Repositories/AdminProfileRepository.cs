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

    public async Task<AdminProfilePageDto> GetAll(
        string? search,
        byte? genderId,
        byte? profileStatusId,
        int page,
        int pageSize)
    {
        using var connection =
            _connectionFactory.CreateConnection();

        using var result =
            await connection.QueryMultipleAsync(
                "usp_Admin_Profile_GetAll",
                new
                {
                    Search = search,
                    GenderId = genderId,
                    ProfileStatusId = profileStatusId,
                    Page = page,
                    PageSize = pageSize
                },
                commandType: CommandType.StoredProcedure,
                commandTimeout: 60
            );

        var profiles = (await result.ReadAsync<AdminProfileDto>()).ToList();
        var totalCount = await result.ReadSingleAsync<int>();
        if (profiles.Count == 0)
        {
            return new AdminProfilePageDto { Items = profiles, TotalCount = totalCount, Page = page, PageSize = pageSize };
        }

        var maritalStatuses = await connection.QueryAsync<ProfileMaritalStatusRow>(
            "SELECT UserId, IsMarried FROM dbo.UserAccount WHERE UserId IN @UserIds",
            new { UserIds = profiles.Select(profile => profile.UserId).ToArray() }
        );
        var maritalStatusByUserId = maritalStatuses.ToDictionary(row => row.UserId, row => row.IsMarried);
        foreach (var profile in profiles)
        {
            profile.IsMarried = maritalStatusByUserId.GetValueOrDefault(profile.UserId);
        }

        var membershipPlans = await connection.QueryAsync<ProfileMembershipPlanRow>(
            """
            ;WITH RankedActiveSubscriptions AS
            (
                SELECT
                    US.UserId,
                    US.MembershipPlanId,
                    ROW_NUMBER() OVER
                    (
                        PARTITION BY US.UserId
                        ORDER BY US.CreatedAt DESC, US.SubscriptionId DESC
                    ) AS RowNumber
                FROM dbo.UserSubscription US
                WHERE US.UserId IN @UserIds
                  AND US.IsActive = 1
                  AND US.IsApproved = 1
                  AND US.StartDate <= CONVERT(date, GETDATE())
                  AND US.EndDate >= CONVERT(date, GETDATE())
            )
            SELECT
                UA.UserId,
                COALESCE(ActivePlan.PlanName, N'Free') AS MembershipPlanName
            FROM dbo.UserAccount UA
            LEFT JOIN RankedActiveSubscriptions ActiveSubscription
                ON ActiveSubscription.UserId = UA.UserId
               AND ActiveSubscription.RowNumber = 1
            LEFT JOIN dbo.MembershipPlanMaster ActivePlan
                ON ActivePlan.MembershipPlanId = ActiveSubscription.MembershipPlanId
            WHERE UA.UserId IN @UserIds;
            """,
            new { UserIds = profiles.Select(profile => profile.UserId).ToArray() }
        );
        var membershipPlanByUserId = membershipPlans.ToDictionary(
            row => row.UserId,
            row => row.MembershipPlanName
        );
        foreach (var profile in profiles)
        {
            profile.MembershipPlanName = membershipPlanByUserId.GetValueOrDefault(profile.UserId);
        }

        await ApplyBrokerAttribution(connection, profiles);

        return new AdminProfilePageDto { Items = profiles, TotalCount = totalCount, Page = page, PageSize = pageSize };
    }
   public async Task<AdminProfileDetailResult?> GetById(int userId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    var result =
        await connection.QueryFirstOrDefaultAsync<AdminProfileDetailResult>(
            "usp_Admin_Profile_GetById",
            new
            {
                UserId = userId
            },
            commandType: CommandType.StoredProcedure
        );

    if (result is not null)
    {
        var attributionProfile = new AdminProfileDto { UserId = result.UserId };
        await ApplyBrokerAttribution(connection, new[] { attributionProfile });
        result.RegistrationType = attributionProfile.RegistrationType;
        result.BrokerName = attributionProfile.BrokerName;
        result.BrokerCompanyName = attributionProfile.BrokerCompanyName;
    }

    return result;
}

private static async Task ApplyBrokerAttribution(
    System.Data.IDbConnection connection,
    IEnumerable<AdminProfileDto> profiles)
{
    var profileList = profiles.ToList();
    if (profileList.Count == 0) return;

    var attributionRows = await connection.QueryAsync<BrokerAttributionRow>(
        """
        SELECT
            UA.UserId,
            CASE WHEN UA.BrokerId IS NULL THEN N'Self Registered' ELSE N'Broker Registered' END AS RegistrationType,
            BP.BrokerName,
            BP.CompanyName AS BrokerCompanyName
        FROM dbo.UserAccount UA
        LEFT JOIN dbo.BrokerProfile BP ON BP.BrokerId = UA.BrokerId
        WHERE UA.UserId IN @UserIds;
        """,
        new { UserIds = profileList.Select(profile => profile.UserId).ToArray() });

    var byUserId = attributionRows.ToDictionary(row => row.UserId);
    foreach (var profile in profileList)
    {
        if (!byUserId.TryGetValue(profile.UserId, out var attribution)) continue;
        profile.RegistrationType = attribution.RegistrationType;
        profile.BrokerName = attribution.BrokerName;
        profile.BrokerCompanyName = attribution.BrokerCompanyName;
    }
}

public async Task<IEnumerable<AdminProfilePhotoDto>> GetPhotos(int userId)
{
    using var connection = _connectionFactory.CreateConnection();

    return await connection.QueryAsync<AdminProfilePhotoDto>(
        """
        SELECT PhotoId, PhotoUrl, IsProfilePhoto, DisplayOrder
        FROM dbo.UserPhoto
        WHERE UserId = @UserId AND IsActive = 1
        ORDER BY IsProfilePhoto DESC, DisplayOrder, PhotoId;
        """,
        new { UserId = userId }
    );
}

public async Task<bool> DeleteProfile(int userId)
{
    using var connection = _connectionFactory.CreateConnection();

    var affectedRows = await connection.ExecuteAsync(
        "UPDATE dbo.UserAccount SET IsActive = 0, UpdatedAt = GETDATE() WHERE UserId = @UserId AND IsActive = 1",
        new { UserId = userId }
    );

    return affectedRows > 0;
}

public async Task<bool> UpdateMobileNumber(int userId, string? mobileNumber)
{
    using var connection = _connectionFactory.CreateConnection();

    const string sql = """
        UPDATE dbo.UserAccount
        SET MobileNumber = @MobileNumber,
            IsMobileVerified = CASE
                WHEN ISNULL(MobileNumber, '') <> ISNULL(@MobileNumber, '') THEN 0
                ELSE IsMobileVerified
            END,
            UpdatedAt = GETDATE()
        WHERE UserId = @UserId AND IsActive = 1;
        """;

    return await connection.ExecuteAsync(sql, new { UserId = userId, MobileNumber = mobileNumber }) > 0;
}

public async Task<bool> ResetPassword(int userId, string passwordHash)
{
    using var connection = _connectionFactory.CreateConnection();
    const string sql = "UPDATE dbo.UserAccount SET PasswordHash = @PasswordHash, UpdatedAt = GETDATE() WHERE UserId = @UserId AND IsActive = 1;";
    return await connection.ExecuteAsync(sql, new { UserId = userId, PasswordHash = passwordHash }) > 0;
}

public async Task<AdminProfileStatusUpdateResult?> UpdateStatus(
    int userId,
    byte profileStatusId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<AdminProfileStatusUpdateResult>(
        "usp_Admin_Profile_UpdateStatus",
        new
        {
            UserId = userId,
            ProfileStatusId = profileStatusId
        },
        commandType: CommandType.StoredProcedure
    );
}

public async Task<bool> UpdateMaritalStatus(int userId, bool isMarried)
{
    using var connection = _connectionFactory.CreateConnection();
    const string sql = """
        UPDATE dbo.UserAccount
        SET IsMarried = @IsMarried,
            UpdatedAt = GETDATE()
        WHERE UserId = @UserId AND IsActive = 1;
        """;

    return await connection.ExecuteAsync(sql, new { UserId = userId, IsMarried = isMarried }) > 0;
}

public async Task<AdminMarkMarriedResult?> MarkAsMarried(
    int userId,
    int adminUserId)
{
    using var connection =
        _connectionFactory.CreateConnection();

    return await connection.QueryFirstOrDefaultAsync<AdminMarkMarriedResult>(
        "usp_Admin_MarkProfileAsMarried",
        new
        {
            MarriedUserId = userId,
            AdminUserId = adminUserId
        },
        commandType: CommandType.StoredProcedure
    );
}

private sealed class ProfileMaritalStatusRow
{
    public int UserId { get; set; }

    public bool IsMarried { get; set; }
}

private sealed class ProfileMembershipPlanRow
{
    public int UserId { get; set; }

    public string? MembershipPlanName { get; set; }
}

private sealed class BrokerAttributionRow
{
    public int UserId { get; set; }
    public string RegistrationType { get; set; } = "Self Registered";
    public string? BrokerName { get; set; }
    public string? BrokerCompanyName { get; set; }
}
}
