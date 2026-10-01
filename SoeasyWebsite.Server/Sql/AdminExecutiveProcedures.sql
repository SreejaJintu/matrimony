IF OBJECT_ID(N'dbo.Executive', N'U') IS NULL
    THROW 50001, 'dbo.Executive must be created before installing Admin Executive procedures.', 1;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Executive_GetAll
    @Search NVARCHAR(200) = NULL,
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ExecutiveId,
        FullName,
        UserName,
        Email,
        MobileNumber,
        IsActive,
        LastLogin,
        CreatedAt,
        UpdatedAt
    FROM dbo.Executive
    WHERE (@IsActive IS NULL OR IsActive = @IsActive)
      AND (
          @Search IS NULL
          OR FullName LIKE N'%' + @Search + N'%'
          OR UserName LIKE N'%' + @Search + N'%'
          OR Email LIKE N'%' + @Search + N'%'
          OR MobileNumber LIKE N'%' + @Search + N'%'
      )
    ORDER BY CreatedAt DESC, ExecutiveId DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Executive_GetById
    @ExecutiveId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ExecutiveId,
        FullName,
        UserName,
        Email,
        MobileNumber,
        IsActive,
        LastLogin,
        CreatedAt,
        UpdatedAt
    FROM dbo.Executive
    WHERE ExecutiveId = @ExecutiveId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Executive_Create
    @FullName NVARCHAR(200),
    @UserName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @MobileNumber NVARCHAR(20) = NULL,
    @PasswordHash NVARCHAR(255),
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.Executive WHERE UserName = @UserName)
    BEGIN
        SELECT 2 AS ResultCode,
               N'An Executive with this username already exists.' AS Message,
               CAST(NULL AS INT) AS ExecutiveId;
        RETURN;
    END;

    BEGIN TRY
        INSERT INTO dbo.Executive
            (FullName, UserName, Email, MobileNumber, PasswordHash, IsActive)
        VALUES
            (@FullName, @UserName, @Email, @MobileNumber, @PasswordHash, @IsActive);

        SELECT 1 AS ResultCode,
               N'Executive created successfully.' AS Message,
               CONVERT(INT, SCOPE_IDENTITY()) AS ExecutiveId;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() IN (2601, 2627)
        BEGIN
            SELECT 2 AS ResultCode,
                   N'An Executive with this username already exists.' AS Message,
                   CAST(NULL AS INT) AS ExecutiveId;
            RETURN;
        END;

        THROW;
    END CATCH;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Executive_Update
    @ExecutiveId INT,
    @FullName NVARCHAR(200),
    @UserName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @MobileNumber NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Executive WHERE ExecutiveId = @ExecutiveId)
    BEGIN
        SELECT 0 AS ResultCode, N'Executive not found.' AS Message, @ExecutiveId AS ExecutiveId;
        RETURN;
    END;

    IF EXISTS (
        SELECT 1
        FROM dbo.Executive
        WHERE UserName = @UserName AND ExecutiveId <> @ExecutiveId
    )
    BEGIN
        SELECT 2 AS ResultCode,
               N'An Executive with this username already exists.' AS Message,
               @ExecutiveId AS ExecutiveId;
        RETURN;
    END;

    BEGIN TRY
        UPDATE dbo.Executive
        SET FullName = @FullName,
            UserName = @UserName,
            Email = @Email,
            MobileNumber = @MobileNumber,
            UpdatedAt = SYSUTCDATETIME()
        WHERE ExecutiveId = @ExecutiveId;

        SELECT 1 AS ResultCode, N'Executive updated successfully.' AS Message, @ExecutiveId AS ExecutiveId;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() IN (2601, 2627)
        BEGIN
            SELECT 2 AS ResultCode,
                   N'An Executive with this username already exists.' AS Message,
                   @ExecutiveId AS ExecutiveId;
            RETURN;
        END;

        THROW;
    END CATCH;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Admin_Executive_UpdateStatus
    @ExecutiveId INT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Executive WHERE ExecutiveId = @ExecutiveId)
    BEGIN
        SELECT CAST(0 AS BIT);
        RETURN;
    END;

    UPDATE dbo.Executive
    SET IsActive = @IsActive,
        UpdatedAt = SYSUTCDATETIME()
    WHERE ExecutiveId = @ExecutiveId;

    SELECT CAST(1 AS BIT);
END;
GO