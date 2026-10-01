SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.usp_Admin_Broker_GetEligibleUsers', N'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Admin_Broker_GetEligibleUsers;
GO
IF OBJECT_ID(N'dbo.usp_Admin_Broker_Create', N'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Admin_Broker_Create;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes i
    INNER JOIN sys.index_columns ic
        ON ic.object_id = i.object_id AND ic.index_id = i.index_id
    INNER JOIN sys.columns c
        ON c.object_id = ic.object_id AND c.column_id = ic.column_id
    WHERE i.object_id = OBJECT_ID(N'dbo.BrokerProfile')
      AND i.is_unique = 1
      AND ic.key_ordinal = 1
      AND c.name = N'UserId'
      AND NOT EXISTS
      (
          SELECT 1
          FROM sys.index_columns otherKey
          WHERE otherKey.object_id = i.object_id
            AND otherKey.index_id = i.index_id
            AND otherKey.key_ordinal > 1
      )
)
BEGIN
    CREATE UNIQUE INDEX UX_BrokerProfile_UserId
        ON dbo.BrokerProfile(UserId);
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Broker_GetAll
    @BrokerId int = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        bp.BrokerId,
        bp.UserId,
        bp.BrokerName,
        bp.CompanyName,
        bp.ContactNumber,
        bp.Email,
        bp.IsApproved,
        bp.IsActive,
        bp.ApprovedBy,
        bp.ApprovedAt,
        bp.CreatedAt,
        ua.FullName AS UserFullName,
        ua.ProfileCode,
        ua.MobileNumber AS UserMobileNumber,
        ua.Email AS UserEmail,
        (SELECT COUNT_BIG(*) FROM dbo.UserAccount candidates WHERE candidates.BrokerId = bp.BrokerId) AS CandidateCount
    FROM dbo.BrokerProfile bp
    INNER JOIN dbo.UserAccount ua ON ua.UserId = bp.UserId
    WHERE @BrokerId IS NULL OR bp.BrokerId = @BrokerId
    ORDER BY bp.CreatedAt DESC, bp.BrokerId DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Broker_Register
    @FullName nvarchar(150),
    @MobileNumber varchar(15),
    @AccountEmail nvarchar(150),
    @PasswordHash nvarchar(500),
    @GenderId tinyint,
    @BrokerName nvarchar(150),
    @CompanyName nvarchar(150),
    @ApprovedBy int
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS
        (
            SELECT 1
            FROM dbo.UserAccount WITH (UPDLOCK, HOLDLOCK)
            WHERE MobileNumber = @MobileNumber
        )
        BEGIN
            COMMIT TRANSACTION;
            SELECT -1 AS ResultCode, CAST(NULL AS int) AS BrokerId,
                   N'This mobile number is already registered.' AS Message;
            RETURN;
        END;

        IF EXISTS
        (
            SELECT 1 FROM dbo.UserAccount WITH (UPDLOCK, HOLDLOCK)
            WHERE Email = @AccountEmail
        )
        BEGIN
            COMMIT TRANSACTION;
            SELECT -1 AS ResultCode, CAST(NULL AS int) AS BrokerId,
                   N'This email address is already registered.' AS Message;
            RETURN;
        END;

        INSERT INTO dbo.UserAccount
        (
            ProfileCode,
            FullName,
            MobileNumber,
            Email,
            PasswordHash,
            GenderId
        )
        VALUES
        (
            '',
            @FullName,
            @MobileNumber,
            @AccountEmail,
            @PasswordHash,
            @GenderId
        );

        DECLARE @UserId int = CONVERT(int, SCOPE_IDENTITY());
        DECLARE @ProfileCode varchar(20) =
            'SM' + RIGHT('000000' + CAST(@UserId AS varchar(6)), 6);

        UPDATE dbo.UserAccount
        SET ProfileCode = @ProfileCode
        WHERE UserId = @UserId;

        INSERT INTO dbo.BrokerProfile
        (
            UserId,
            BrokerName,
            CompanyName,
            ContactNumber,
            Email,
            IsApproved,
            IsActive,
            ApprovedBy,
            ApprovedAt,
            CreatedAt
        )
        VALUES
        (
            @UserId,
            @BrokerName,
            @CompanyName,
            @MobileNumber,
            @AccountEmail,
            1,
            1,
            @ApprovedBy,
            SYSUTCDATETIME(),
            SYSUTCDATETIME()
        );

         DECLARE @BrokerId int = CONVERT(int, SCOPE_IDENTITY());
        COMMIT TRANSACTION;

         SELECT 1 AS ResultCode, @BrokerId AS BrokerId,
             N'Broker registered successfully.' AS Message;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        IF ERROR_NUMBER() IN (2601, 2627)
        BEGIN
            SELECT -1 AS ResultCode, CAST(NULL AS int) AS BrokerId,
                   N'This mobile number, email address, or user is already registered.' AS Message;
            RETURN;
        END;

        THROW;
    END CATCH;
END;
GO
