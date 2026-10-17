SET XACT_ABORT ON;

IF OBJECT_ID(N'dbo.BirthStarMaster', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.BirthStarMaster
    (
        BirthStarId SMALLINT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_BirthStarMaster PRIMARY KEY,
        BirthStarName NVARCHAR(100) NOT NULL
            CONSTRAINT UQ_BirthStarMaster_BirthStarName UNIQUE,
        IsActive BIT NOT NULL
            CONSTRAINT DF_BirthStarMaster_IsActive DEFAULT (1)
    );
END;
GO

IF COL_LENGTH(N'dbo.UserProfile', N'BirthStarId') IS NULL
BEGIN
    ALTER TABLE dbo.UserProfile ADD BirthStarId SMALLINT NULL;
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_UserProfile_BirthStarMaster'
      AND parent_object_id = OBJECT_ID(N'dbo.UserProfile')
)
BEGIN
    ALTER TABLE dbo.UserProfile
        ADD CONSTRAINT FK_UserProfile_BirthStarMaster
        FOREIGN KEY (BirthStarId) REFERENCES dbo.BirthStarMaster (BirthStarId);
END;
GO

INSERT INTO dbo.BirthStarMaster (BirthStarName)
SELECT stars.BirthStarName
FROM (VALUES
    (N'Ashwini'),
    (N'Bharani'),
    (N'Krittika'),
    (N'Rohini'),
    (N'Mrigashira'),
    (N'Ardra'),
    (N'Punarvasu'),
    (N'Pushya'),
    (N'Ashlesha'),
    (N'Magha'),
    (N'Purva Phalguni'),
    (N'Uttara Phalguni'),
    (N'Hasta'),
    (N'Chitra'),
    (N'Swati'),
    (N'Vishakha'),
    (N'Anuradha'),
    (N'Jyeshtha'),
    (N'Mula'),
    (N'Purva Ashadha'),
    (N'Uttara Ashadha'),
    (N'Shravana'),
    (N'Dhanishta'),
    (N'Shatabhisha'),
    (N'Purva Bhadrapada'),
    (N'Uttara Bhadrapada'),
    (N'Revati')
) AS stars(BirthStarName)
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.BirthStarMaster existing
    WHERE existing.BirthStarName = stars.BirthStarName
);
GO

CREATE OR ALTER PROCEDURE dbo.usp_Profile_Upsert
(
    @UserId INT,
    @HeightId INT,
    @Weight DECIMAL(5,2),
    @MaritalStatusId INT,
    @MotherTongueId INT,
    @ReligionId INT,
    @CommunityId INT,
    @EducationId INT,
    @OccupationId INT,
    @IncomeId INT,
    @CountryId INT,
    @StateId INT,
    @DistrictId INT,
    @DateOfBirth DATE = NULL,
    @CompanyName NVARCHAR(150) = NULL,
    @Designation NVARCHAR(150) = NULL,
    @Address NVARCHAR(300) = NULL,
    @Pincode NVARCHAR(20) = NULL,
    @AboutMe NVARCHAR(MAX) = NULL,
    @BirthStarId SMALLINT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        DB_NAME() AS CurrentDatabase,
        @UserId AS DebugUserId;

    IF NOT EXISTS (SELECT 1 FROM dbo.UserAccount WHERE UserId = @UserId)
    BEGIN
        SELECT
            CAST(0 AS BIT) AS Success,
            'User account not found.' AS Message,
            0 AS RowsUpdated;
        RETURN;
    END;

    IF EXISTS (SELECT 1 FROM dbo.UserProfile WHERE UserId = @UserId)
    BEGIN
        UPDATE dbo.UserProfile
        SET
            DateOfBirth = @DateOfBirth,
            HeightId = @HeightId,
            Weight = @Weight,
            MaritalStatusId = @MaritalStatusId,
            BirthStarId = @BirthStarId,
            MotherTongueId = @MotherTongueId,
            ReligionId = @ReligionId,
            CommunityId = @CommunityId,
            EducationId = @EducationId,
            OccupationId = @OccupationId,
            CompanyName = @CompanyName,
            Designation = @Designation,
            IncomeId = @IncomeId,
            CountryId = @CountryId,
            StateId = @StateId,
            DistrictId = @DistrictId,
            Address = @Address,
            Pincode = @Pincode,
            AboutMe = @AboutMe,
            UpdatedAt = GETDATE()
        WHERE UserId = @UserId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.UserProfile
        (
            UserId,
            DateOfBirth,
            HeightId,
            Weight,
            MaritalStatusId,
            BirthStarId,
            MotherTongueId,
            ReligionId,
            CommunityId,
            EducationId,
            OccupationId,
            CompanyName,
            Designation,
            IncomeId,
            CountryId,
            StateId,
            DistrictId,
            Address,
            Pincode,
            AboutMe,
            CreatedAt,
            IsActive
        )
        VALUES
        (
            @UserId,
            @DateOfBirth,
            @HeightId,
            @Weight,
            @MaritalStatusId,
            @BirthStarId,
            @MotherTongueId,
            @ReligionId,
            @CommunityId,
            @EducationId,
            @OccupationId,
            @CompanyName,
            @Designation,
            @IncomeId,
            @CountryId,
            @StateId,
            @DistrictId,
            @Address,
            @Pincode,
            @AboutMe,
            GETDATE(),
            1
        );
    END;

    UPDATE dbo.UserAccount
    SET IsProfileCompleted = 1,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId;

    SELECT
        CAST(1 AS BIT) AS Success,
        'Profile saved successfully.' AS Message,
        1 AS RowsUpdated;
END;
GO
