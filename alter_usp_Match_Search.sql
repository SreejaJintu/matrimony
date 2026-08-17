ALTER PROCEDURE [dbo].[usp_Match_Search]
(
    @UserId INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LoggedInGenderId INT;

    -- Get logged in user's gender
    IF @UserId IS NOT NULL
    BEGIN
        SELECT @LoggedInGenderId = GenderId
        FROM UserAccount
        WHERE UserId = @UserId;
    END

    -- Return opposite gender profiles, or all verified profiles if not logged in
    SELECT
        UA.UserId,
        UA.ProfileCode,
        UA.FullName,

        DATEDIFF(YEAR, UP.DateOfBirth, GETDATE())
        - CASE
            WHEN DATEADD(YEAR, DATEDIFF(YEAR, UP.DateOfBirth, GETDATE()), UP.DateOfBirth) > GETDATE()
            THEN 1
            ELSE 0
          END AS Age,

        D.DistrictName AS District,
        S.StateName AS State,

        E.EducationName AS Education,

        O.OccupationName AS Profession,

        C.CommunityName AS Community,

        I.IncomeRange AS Income,

        ISNULL(P.PhotoUrl,'') AS ImageUrl,

        CASE
            WHEN UA.IsMobileVerified = 1
             AND UA.IsEmailVerified = 1
            THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT)
        END AS IsVerified,

        UA.IsPremium

    FROM UserAccount UA

    INNER JOIN UserProfile UP
        ON UA.UserId = UP.UserId

    LEFT JOIN UserPhoto P
        ON UA.UserId = P.UserId
       AND P.IsProfilePhoto = 1
       AND P.IsApproved = 1
       AND P.IsActive = 1

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

    WHERE
        (@UserId IS NULL OR UA.UserId <> @UserId)
        AND (@LoggedInGenderId IS NULL OR UA.GenderId <> @LoggedInGenderId)
        AND UA.IsActive = 1
        AND UA.IsProfileCompleted = 1
        AND UA.ProfileStatusId = 2

    ORDER BY
        UA.CreatedAt DESC;

END
GO
