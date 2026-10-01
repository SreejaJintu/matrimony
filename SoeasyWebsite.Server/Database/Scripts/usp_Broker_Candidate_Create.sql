SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF COL_LENGTH(N'dbo.UserAccount', N'BrokerId') IS NULL
BEGIN
    ALTER TABLE dbo.UserAccount ADD BrokerId int NULL;
END;
GO

IF NOT EXISTS
(
    SELECT 1 FROM sys.foreign_keys
    WHERE name = N'FK_UserAccount_BrokerProfile_BrokerId'
      AND parent_object_id = OBJECT_ID(N'dbo.UserAccount')
)
BEGIN
    ALTER TABLE dbo.UserAccount WITH CHECK
    ADD CONSTRAINT FK_UserAccount_BrokerProfile_BrokerId
        FOREIGN KEY (BrokerId) REFERENCES dbo.BrokerProfile(BrokerId);
END;
GO

IF NOT EXISTS
(
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.UserAccount')
      AND name = N'IX_UserAccount_BrokerId'
)
BEGIN
    CREATE INDEX IX_UserAccount_BrokerId ON dbo.UserAccount(BrokerId);
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Broker_Candidate_Create
    @BrokerId int,
    @FullName nvarchar(150),
    @MobileNumber varchar(15),
    @Email nvarchar(150) = NULL,
    @PasswordHash nvarchar(500),
    @GenderId tinyint,
    @DateOfBirth date = NULL,
    @HeightId smallint = NULL,
    @Weight decimal(5,2) = NULL,
    @MaritalStatusId tinyint = NULL,
    @MotherTongueId smallint = NULL,
    @ReligionId smallint = NULL,
    @CommunityId int = NULL,
    @EducationId smallint = NULL,
    @OccupationId smallint = NULL,
    @CompanyName nvarchar(150) = NULL,
    @Designation nvarchar(150) = NULL,
    @IncomeId smallint = NULL,
    @CountryId smallint = NULL,
    @StateId smallint = NULL,
    @DistrictId smallint = NULL,
    @Address nvarchar(300) = NULL,
    @Pincode nvarchar(10) = NULL,
    @AboutMe nvarchar(max) = NULL,
    @FatherName nvarchar(150) = NULL,
    @FatherOccupationId smallint = NULL,
    @MotherName nvarchar(150) = NULL,
    @MotherOccupationId smallint = NULL,
    @FamilyTypeId tinyint = NULL,
    @FamilyStatusId tinyint = NULL,
    @FamilyValueId tinyint = NULL,
    @NativePlace nvarchar(150) = NULL,
    @Brothers tinyint = 0,
    @MarriedBrothers tinyint = 0,
    @Sisters tinyint = 0,
    @MarriedSisters tinyint = 0,
    @AboutFamily nvarchar(max) = NULL,
    @AgeFrom tinyint = NULL,
    @AgeTo tinyint = NULL,
    @HeightFromId smallint = NULL,
    @HeightToId smallint = NULL,
    @PreferredMaritalStatusId tinyint = NULL,
    @PreferredReligionId smallint = NULL,
    @PreferredCommunityId int = NULL,
    @PreferredMotherTongueId smallint = NULL,
    @PreferredEducationId smallint = NULL,
    @PreferredOccupationId smallint = NULL,
    @PreferredIncomeId smallint = NULL,
    @PreferredCountryId smallint = NULL,
    @PreferredStateId smallint = NULL,
    @PreferredDistrictId smallint = NULL,
    @PreferredDescription nvarchar(500) = NULL,
    @PhotosJson nvarchar(max) = N'[]'
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS
        (
            SELECT 1 FROM dbo.BrokerProfile WITH (UPDLOCK, HOLDLOCK)
            WHERE BrokerId = @BrokerId AND IsApproved = 1 AND IsActive = 1
        )
            THROW 51001, 'Broker is not approved and active.', 1;

        IF EXISTS
        (
            SELECT 1 FROM dbo.UserAccount WITH (UPDLOCK, HOLDLOCK)
            WHERE MobileNumber = @MobileNumber
        )
            THROW 51002, 'This mobile number is already registered.', 1;

        IF @Email IS NOT NULL AND EXISTS
        (
            SELECT 1 FROM dbo.UserAccount WITH (UPDLOCK, HOLDLOCK)
            WHERE Email = @Email
        )
            THROW 51003, 'This email address is already registered.', 1;

        INSERT INTO dbo.UserAccount
        (
            ProfileCode, FullName, MobileNumber, Email, PasswordHash,
            GenderId, BrokerId
        )
        VALUES ('', @FullName, @MobileNumber, @Email, @PasswordHash, @GenderId, @BrokerId);

        DECLARE @UserId int = CONVERT(int, SCOPE_IDENTITY());
        DECLARE @ProfileCode varchar(20) =
            'SM' + RIGHT('000000' + CAST(@UserId AS varchar(6)), 6);

        UPDATE dbo.UserAccount SET ProfileCode = @ProfileCode WHERE UserId = @UserId;

        INSERT INTO dbo.UserProfile
        (
            UserId, DateOfBirth, HeightId, Weight, MaritalStatusId, MotherTongueId,
            ReligionId, CommunityId, EducationId, OccupationId, CompanyName,
            Designation, IncomeId, CountryId, StateId, DistrictId, Address,
            Pincode, AboutMe, CreatedAt, IsActive
        )
        VALUES
        (
            @UserId, @DateOfBirth, @HeightId, @Weight, @MaritalStatusId, @MotherTongueId,
            @ReligionId, @CommunityId, @EducationId, @OccupationId, @CompanyName,
            @Designation, @IncomeId, @CountryId, @StateId, @DistrictId, @Address,
            @Pincode, @AboutMe, GETDATE(), 1
        );

        INSERT INTO dbo.UserFamily
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

        INSERT INTO dbo.UserPreference
        (
            UserId, AgeFrom, AgeTo, HeightFromId, HeightToId, MaritalStatusId,
            ReligionId, CommunityId, MotherTongueId, EducationId, OccupationId,
            IncomeId, CountryId, StateId, DistrictId, PreferredDescription, CreatedAt, IsActive
        )
        VALUES
        (
            @UserId, @AgeFrom, @AgeTo, @HeightFromId, @HeightToId, @PreferredMaritalStatusId,
            @PreferredReligionId, @PreferredCommunityId, @PreferredMotherTongueId,
            @PreferredEducationId, @PreferredOccupationId, @PreferredIncomeId,
            @PreferredCountryId, @PreferredStateId, @PreferredDistrictId,
            @PreferredDescription, GETDATE(), 1
        );

        IF ISJSON(@PhotosJson) <> 1
            THROW 51004, 'Photos must be a JSON array.', 1;

        INSERT INTO dbo.UserPhoto
        (
            UserId, PhotoUrl, IsProfilePhoto, DisplayOrder, IsApproved, CreatedAt, IsActive
        )
        SELECT
            @UserId,
            p.PhotoUrl,
            p.IsProfilePhoto,
            p.DisplayOrder,
            1,
            GETDATE(),
            1
        FROM OPENJSON(@PhotosJson)
        WITH
        (
            PhotoUrl nvarchar(500) '$.PhotoUrl',
            IsProfilePhoto bit '$.IsProfilePhoto',
            DisplayOrder int '$.DisplayOrder'
        ) p;

        COMMIT TRANSACTION;
        SELECT @UserId AS UserId, @ProfileCode AS ProfileCode;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
