using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.ProfileShare;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public sealed class ProfileShareRepository : IProfileShareRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public ProfileShareRepository(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;

    public async Task<(bool Success, string? Error)> CreateAsync(int paidUserId, IReadOnlyCollection<int> profileUserIds, int adminId)
    {
        using var connection = _connectionFactory.CreateConnection();
        if (connection.State != ConnectionState.Open) connection.Open();
        using var transaction = connection.BeginTransaction(IsolationLevel.Serializable);

        try
        {
            const string paidUserSql = """
                SELECT COUNT(1)
                FROM dbo.UserAccount UA WITH (UPDLOCK, HOLDLOCK)
                WHERE UA.UserId = @PaidUserId
                  AND UA.IsActive = 1
                  AND (
                      UA.IsPremium = 1
                      OR UA.MembershipPlanId > 1
                      OR EXISTS
                      (
                          SELECT 1
                          FROM dbo.UserSubscription US WITH (UPDLOCK, HOLDLOCK)
                          WHERE US.UserId = UA.UserId
                            AND US.IsActive = 1
                            AND US.IsApproved = 1
                            AND US.StartDate <= CONVERT(date, GETDATE())
                            AND US.EndDate >= CONVERT(date, GETDATE())
                      )
                  );
                """;

            var isPaidUser = await connection.ExecuteScalarAsync<int>(paidUserSql, new { PaidUserId = paidUserId }, transaction) > 0;
            if (!isPaidUser)
            {
                transaction.Rollback();
                return (false, "The selected recipient is not an active paid user.");
            }

            const string profilesSql = """
                SELECT COUNT(DISTINCT UA.UserId)
                FROM dbo.UserAccount UA WITH (UPDLOCK, HOLDLOCK)
                LEFT JOIN dbo.UserProfile UP ON UP.UserId = UA.UserId
                WHERE UA.UserId IN @ProfileUserIds
                  AND UA.UserId <> @PaidUserId
                  AND UA.IsActive = 1
                  AND UA.ProfileStatusId = 2
                  AND EXISTS
                  (
                      SELECT 1
                      FROM dbo.UserPhoto PH
                      WHERE PH.UserId = UA.UserId
                        AND PH.IsProfilePhoto = 1
                        AND PH.IsApproved = 1
                        AND PH.IsActive = 1
                        AND NULLIF(LTRIM(RTRIM(PH.PhotoUrl)), '') IS NOT NULL
                  );
                """;

            var validProfileCount = await connection.ExecuteScalarAsync<int>(profilesSql,
                new { ProfileUserIds = profileUserIds.ToArray(), PaidUserId = paidUserId }, transaction);
            if (validProfileCount != profileUserIds.Count)
            {
                transaction.Rollback();
                return (false, "One or more selected profiles are not eligible approved profiles, or match the recipient.");
            }

            const string duplicateSql = """
                SELECT TOP (1) ProfileUserId
                FROM dbo.PaidUserProfileShare WITH (UPDLOCK, HOLDLOCK)
                WHERE PaidUserId = @PaidUserId
                  AND ProfileUserId IN @ProfileUserIds;
                """;
            var alreadyShared = await connection.QueryFirstOrDefaultAsync<int?>(duplicateSql,
                new { PaidUserId = paidUserId, ProfileUserIds = profileUserIds.ToArray() }, transaction);
            if (alreadyShared.HasValue)
            {
                transaction.Rollback();
                return (false, $"Profile {alreadyShared.Value} has already been shared with this user.");
            }

            const string insertShareSql = """
                INSERT INTO dbo.PaidUserProfileShare
                    (PaidUserId, ProfileUserId, SentByAdminId, SentAt, IsViewed)
                OUTPUT INSERTED.ShareId
                VALUES
                    (@PaidUserId, @ProfileUserId, @AdminId, GETDATE(), 0);
                """;
            const string insertNotificationSql = """
                INSERT INTO dbo.UserNotification
                    (UserId, NotificationType, Title, Message, ReferenceId, IsRead, CreatedAt)
                VALUES
                    (@PaidUserId, N'ProfileSuggestion', N'New Profile Suggestion',
                     N'Admin has shared a profile with you.', @ShareId, 0, GETDATE());
                """;

            foreach (var profileUserId in profileUserIds)
            {
                var shareId = await connection.ExecuteScalarAsync<int>(insertShareSql,
                    new { PaidUserId = paidUserId, ProfileUserId = profileUserId, AdminId = adminId }, transaction);
                await connection.ExecuteAsync(insertNotificationSql,
                    new { PaidUserId = paidUserId, ShareId = shareId }, transaction);
            }

            transaction.Commit();
            return (true, null);
        }
        catch
        {
            try { transaction.Rollback(); } catch { /* Preserve the original database exception. */ }
            throw;
        }
    }

    public async Task<IReadOnlyList<SharedProfileDto>> GetMineAsync(int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<SharedProfileDto>(
            SharedProfileSelect + " AND SH.PaidUserId = @UserId ORDER BY SH.SentAt DESC, SH.ShareId DESC;",
            new { UserId = userId });
        return rows.AsList();
    }

    public async Task<SharedProfileDto?> GetMineByIdAsync(int shareId, int userId)
    {
        using var connection = _connectionFactory.CreateConnection();
        if (connection.State != ConnectionState.Open) connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var profile = await connection.QuerySingleOrDefaultAsync<SharedProfileDto>(
                SharedProfileSelect + " AND SH.ShareId = @ShareId AND SH.PaidUserId = @UserId;",
                new { ShareId = shareId, UserId = userId }, transaction);

            if (profile is null)
            {
                transaction.Rollback();
                return null;
            }

            await connection.ExecuteAsync("""
                UPDATE dbo.PaidUserProfileShare
                SET IsViewed = 1, ViewedAt = COALESCE(ViewedAt, GETDATE())
                WHERE ShareId = @ShareId AND PaidUserId = @UserId;
                """, new { ShareId = shareId, UserId = userId }, transaction);
            profile.IsViewed = true;
            transaction.Commit();
            return profile;
        }
        catch
        {
            try { transaction.Rollback(); } catch { /* Preserve the original database exception. */ }
            throw;
        }
    }

    private const string SharedProfileSelect = """
        SELECT
            SH.ShareId,
            UA.UserId AS ProfileUserId,
            UA.ProfileCode,
            UA.FullName,
            CASE WHEN UP.DateOfBirth IS NULL THEN NULL ELSE
                DATEDIFF(YEAR, UP.DateOfBirth, GETDATE())
                - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, UP.DateOfBirth, GETDATE()), UP.DateOfBirth) > GETDATE() THEN 1 ELSE 0 END
            END AS Age,
            G.GenderName AS Gender,
            COALESCE(NULLIF(D.DistrictName, ''), NULLIF(S.StateName, '')) AS Location,
            E.EducationName AS Education,
            COALESCE(NULLIF(O.OccupationName, ''), NULLIF(UP.Designation, '')) AS Profession,
            PH.PhotoUrl,
            SH.SentAt,
            SH.IsViewed
        FROM dbo.PaidUserProfileShare SH
        INNER JOIN dbo.UserAccount UA ON UA.UserId = SH.ProfileUserId
        LEFT JOIN dbo.UserProfile UP ON UP.UserId = UA.UserId
        LEFT JOIN dbo.GenderMaster G ON G.GenderId = UA.GenderId
        LEFT JOIN dbo.DistrictMaster D ON D.DistrictId = UP.DistrictId
        LEFT JOIN dbo.StateMaster S ON S.StateId = UP.StateId
        LEFT JOIN dbo.EducationMaster E ON E.EducationId = UP.EducationId
        LEFT JOIN dbo.OccupationMaster O ON O.OccupationId = UP.OccupationId
        OUTER APPLY
        (
            SELECT TOP (1) P.PhotoUrl
            FROM dbo.UserPhoto P
            WHERE P.UserId = UA.UserId
              AND P.IsProfilePhoto = 1
              AND P.IsApproved = 1
              AND P.IsActive = 1
              AND NULLIF(LTRIM(RTRIM(P.PhotoUrl)), '') IS NOT NULL
            ORDER BY P.CreatedAt DESC, P.PhotoId DESC
        ) PH
        WHERE UA.IsActive = 1
          AND UA.ProfileStatusId = 2
          AND PH.PhotoUrl IS NOT NULL
        """;
}
