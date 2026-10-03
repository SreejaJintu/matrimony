using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Match;
using SoeasyWebsite.Server.RepositoryInterfaces;
using System.Data;

namespace SoeasyWebsite.Server.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public MatchRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<MatchCardDto>> SearchMatches(MatchSearchRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();

        const string sql = @"
            DECLARE @LoggedInGenderId TINYINT = NULL;

            IF (@UserId IS NOT NULL AND @UserId > 0)
            BEGIN
                SELECT @LoggedInGenderId = GenderId
                FROM dbo.UserAccount
                WHERE UserId = @UserId;
            END

            SELECT TOP (@Limit)
                UA.UserId,
                UA.ProfileCode,
                UA.FullName,
                DATEDIFF(YEAR, UP.DateOfBirth, GETDATE())
                - CASE
                    WHEN UP.DateOfBirth IS NOT NULL AND DATEADD(YEAR, DATEDIFF(YEAR, UP.DateOfBirth, GETDATE()), UP.DateOfBirth) > GETDATE()
                    THEN 1
                    ELSE 0
                  END AS Age,
                H.HeightValue AS Height,
                ISNULL(D.DistrictName, '') AS District,
                ISNULL(S.StateName, '') AS State,
                ISNULL(R.ReligionName, '') AS Religion,
                ISNULL(E.EducationName, '') AS Education,
                ISNULL(O.OccupationName, UP.Designation) AS Profession,
                ISNULL(C.CommunityName, '') AS Community,
                ISNULL(I.IncomeRange, '') AS Income,
                ISNULL(P.PhotoUrl, '') AS ImageUrl,
                CASE
                    WHEN UA.IsMobileVerified = 1 OR UA.IsEmailVerified = 1
                    THEN CAST(1 AS BIT)
                    ELSE CAST(0 AS BIT)
                END AS IsVerified,
                UA.IsPremium
            FROM dbo.UserAccount UA
            LEFT JOIN dbo.UserProfile UP
                ON UA.UserId = UP.UserId
            LEFT JOIN HeightMaster H
                ON UP.HeightId = H.HeightId
            LEFT JOIN ReligionMaster R
                ON UP.ReligionId = R.ReligionId
            LEFT JOIN EducationMaster E
                ON UP.EducationId = E.EducationId
            LEFT JOIN OccupationMaster O
                ON UP.OccupationId = O.OccupationId
            LEFT JOIN CommunityMaster C
                ON UP.CommunityId = C.CommunityId
            LEFT JOIN IncomeMaster I
                ON UP.IncomeId = I.IncomeId
            LEFT JOIN DistrictMaster D
                ON UP.DistrictId = D.DistrictId
            LEFT JOIN StateMaster S
                ON UP.StateId = S.StateId
            OUTER APPLY
            (
                SELECT TOP 1 UPH.PhotoUrl
                FROM dbo.UserPhoto UPH
                WHERE UPH.UserId = UA.UserId
                  AND UPH.IsActive = 1
                ORDER BY UPH.IsProfilePhoto DESC, UPH.IsApproved DESC, UPH.CreatedAt DESC
            ) P
            WHERE
                UA.IsActive = 1
                AND (@UserId IS NULL OR @UserId = 0 OR UA.UserId <> @UserId)
                AND (@LoggedInGenderId IS NULL OR UA.GenderId <> @LoggedInGenderId)
                AND (@GenderId IS NULL OR @GenderId = 0 OR UA.GenderId = @GenderId)
                AND (@ReligionId IS NULL OR @ReligionId = 0 OR UP.ReligionId = @ReligionId)
                AND (@CommunityId IS NULL OR @CommunityId = 0 OR UP.CommunityId = @CommunityId)
                AND (@EducationId IS NULL OR @EducationId = 0 OR UP.EducationId = @EducationId)
                AND (@OccupationId IS NULL OR @OccupationId = 0 OR UP.OccupationId = @OccupationId)
                AND (@StateId IS NULL OR @StateId = 0 OR UP.StateId = @StateId)
                AND (@DistrictId IS NULL OR @DistrictId = 0 OR UP.DistrictId = @DistrictId)
                AND (@SearchText IS NULL OR @SearchText = '' OR UA.FullName LIKE '%' + @SearchText + '%' OR UA.ProfileCode LIKE '%' + @SearchText + '%')
                AND (@OnlyVerified IS NULL OR @OnlyVerified = 0 OR UA.IsMobileVerified = 1 OR UA.IsEmailVerified = 1)
                AND (
                    -- Show approved profiles (ProfileStatusId = 2) or active pending if none approved
                    UA.ProfileStatusId = 2 
                    OR NOT EXISTS (SELECT 1 FROM dbo.UserAccount WHERE ProfileStatusId = 2 AND IsActive = 1)
                )
            ORDER BY
                CASE WHEN P.PhotoUrl IS NOT NULL AND P.PhotoUrl <> '' THEN 0 ELSE 1 END,
                UA.CreatedAt DESC;
        ";

        return await connection.QueryAsync<MatchCardDto>(sql, new
        {
            dto.UserId,
            dto.GenderId,
            dto.ReligionId,
            dto.CommunityId,
            dto.EducationId,
            dto.OccupationId,
            dto.StateId,
            dto.DistrictId,
            dto.SearchText,
            dto.OnlyVerified,
            Limit = Math.Clamp(dto.Limit ?? int.MaxValue, 1, 100)
        });
    }
}
