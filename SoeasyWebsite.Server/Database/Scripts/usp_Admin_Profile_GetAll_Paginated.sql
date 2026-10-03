/*
    Deploy this procedure update to the application database before using the
    paginated Admin Profiles endpoint. The API expects the profile rows as the
    first result set and the filtered total count as the second result set.
*/
CREATE OR ALTER PROCEDURE dbo.usp_Admin_Profile_GetAll
(
    @Search NVARCHAR(150) = NULL,
    @GenderId TINYINT = NULL,
    @ProfileStatusId TINYINT = NULL,
    @Page INT = 1,
    @PageSize INT = 25
)
AS
BEGIN
    SET NOCOUNT ON;

    SET @Page = CASE WHEN @Page < 1 THEN 1 ELSE @Page END;
    SET @PageSize = CASE WHEN @PageSize < 1 THEN 25 WHEN @PageSize > 100 THEN 100 ELSE @PageSize END;

    SELECT
        UA.UserId,
        UA.ProfileCode,
        UA.FullName,
        UA.MobileNumber,
        UA.Email,
        UA.GenderId,
        G.GenderName,
        UA.ProfileStatusId,
        PS.StatusName,
        UA.IsActive,
        UA.IsProfileCompleted,
        UA.IsPremium,
        UA.CreatedAt,
        UP.DateOfBirth,
        UP.City,
        UP.StateId,
        S.StateName,
        UP.DistrictId,
        D.DistrictName,
        UP.EducationId,
        E.EducationName,
        UP.OccupationId,
        O.OccupationName,
        UP.CommunityId,
        C.CommunityName,
        UP.IncomeId,
        I.IncomeRange,
        UP.CompanyName,
        UP.Designation,
        ISNULL(P.PhotoUrl, '') AS ProfileImageUrl
    FROM dbo.UserAccount UA
    LEFT JOIN dbo.GenderMaster G ON UA.GenderId = G.GenderId
    LEFT JOIN dbo.ProfileStatusMaster PS ON UA.ProfileStatusId = PS.ProfileStatusId
    LEFT JOIN dbo.UserProfile UP ON UA.UserId = UP.UserId
    LEFT JOIN dbo.StateMaster S ON UP.StateId = S.StateId
    LEFT JOIN dbo.DistrictMaster D ON UP.DistrictId = D.DistrictId
    LEFT JOIN dbo.EducationMaster E ON UP.EducationId = E.EducationId
    LEFT JOIN dbo.OccupationMaster O ON UP.OccupationId = O.OccupationId
    LEFT JOIN dbo.CommunityMaster C ON UP.CommunityId = C.CommunityId
    LEFT JOIN dbo.IncomeMaster I ON UP.IncomeId = I.IncomeId
    OUTER APPLY
    (
        SELECT TOP 1 UPH.PhotoUrl
        FROM dbo.UserPhoto UPH
        WHERE UPH.UserId = UA.UserId
          AND UPH.IsProfilePhoto = 1
          AND UPH.IsApproved = 1
          AND UPH.IsActive = 1
        ORDER BY UPH.CreatedAt DESC
    ) P
    WHERE
        (@Search IS NULL OR @Search = ''
         OR UA.FullName LIKE '%' + @Search + '%'
         OR UA.ProfileCode LIKE '%' + @Search + '%'
         OR UA.MobileNumber LIKE '%' + @Search + '%')
        AND (@GenderId IS NULL OR UA.GenderId = @GenderId)
        AND (@ProfileStatusId IS NULL OR UA.ProfileStatusId = @ProfileStatusId)
        AND UA.IsActive = 1
        AND EXISTS
        (
            SELECT 1
            FROM dbo.UserPhoto ImagePhoto
            WHERE ImagePhoto.UserId = UA.UserId
              AND ImagePhoto.IsProfilePhoto = 1
              AND ImagePhoto.IsApproved = 1
              AND ImagePhoto.IsActive = 1
              AND NULLIF(LTRIM(RTRIM(ImagePhoto.PhotoUrl)), '') IS NOT NULL
        )
    ORDER BY UA.CreatedAt DESC, UA.UserId DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(1) AS TotalCount
    FROM dbo.UserAccount UA
    WHERE
        (@Search IS NULL OR @Search = ''
         OR UA.FullName LIKE '%' + @Search + '%'
         OR UA.ProfileCode LIKE '%' + @Search + '%'
         OR UA.MobileNumber LIKE '%' + @Search + '%')
        AND (@GenderId IS NULL OR UA.GenderId = @GenderId)
        AND (@ProfileStatusId IS NULL OR UA.ProfileStatusId = @ProfileStatusId)
        AND UA.IsActive = 1
        AND EXISTS
        (
            SELECT 1
            FROM dbo.UserPhoto ImagePhoto
            WHERE ImagePhoto.UserId = UA.UserId
              AND ImagePhoto.IsProfilePhoto = 1
              AND ImagePhoto.IsApproved = 1
              AND ImagePhoto.IsActive = 1
              AND NULLIF(LTRIM(RTRIM(ImagePhoto.PhotoUrl)), '') IS NOT NULL
        );
END;
GO
