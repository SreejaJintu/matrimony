-- ==========================================================================================
-- GSeven / Soesy Matrimony: Subscription & Membership Plan Database Setup
-- Description: Sets up the ₹2,000 membership plan (20 profile unlocks, 180 days validity),
--              payment reference submission, admin approval, and profile unlock tracking.
-- ==========================================================================================

USE [Soesy_New2026]; -- Change DB name if different
GO

-- 1. Ensure MembershipPlanMaster exists with ProfileViewLimit column
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MembershipPlanMaster')
BEGIN
    CREATE TABLE [dbo].[MembershipPlanMaster](
        [MembershipPlanId] [tinyint] IDENTITY(1,1) NOT NULL,
        [PlanName] [nvarchar](50) NOT NULL,
        [Amount] [decimal](10, 2) NOT NULL,
        [ValidityDays] [int] NOT NULL,
        [ProfileViewLimit] [int] NOT NULL DEFAULT 20,
        [CanViewContact] [bit] NULL DEFAULT 1,
        [CanChat] [bit] NULL DEFAULT 1,
        [UnlimitedInterest] [bit] NULL DEFAULT 1,
        [IsActive] [bit] NULL DEFAULT 1,
        CONSTRAINT [PK_MembershipPlanMaster] PRIMARY KEY CLUSTERED ([MembershipPlanId] ASC)
    );
END
ELSE
BEGIN
    -- Add ProfileViewLimit column if missing
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('MembershipPlanMaster') AND name = 'ProfileViewLimit')
    BEGIN
        ALTER TABLE [dbo].[MembershipPlanMaster] ADD [ProfileViewLimit] [int] NOT NULL DEFAULT 20;
    END
END
GO

-- 2. Seed / Update standard plans (Free & ₹2,000 Premium Plan)
IF NOT EXISTS (SELECT 1 FROM [dbo].[MembershipPlanMaster] WHERE [PlanName] = 'Free')
BEGIN
    SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] ON;
    INSERT INTO [dbo].[MembershipPlanMaster] ([MembershipPlanId], [PlanName], [Amount], [ValidityDays], [ProfileViewLimit], [CanViewContact], [CanChat], [UnlimitedInterest], [IsActive])
    VALUES (1, N'Free', 0.00, 30, 0, 0, 0, 0, 1);
    SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[MembershipPlanMaster] WHERE [PlanName] = 'Premium' OR [Amount] = 2000.00)
BEGIN
    SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] ON;
    INSERT INTO [dbo].[MembershipPlanMaster] ([MembershipPlanId], [PlanName], [Amount], [ValidityDays], [ProfileViewLimit], [CanViewContact], [CanChat], [UnlimitedInterest], [IsActive])
    VALUES (2, N'Premium', 2000.00, 180, 20, 1, 1, 1, 1);
    SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] OFF;
END
ELSE
BEGIN
    UPDATE [dbo].[MembershipPlanMaster]
    SET [PlanName] = N'Premium',
        [Amount] = 2000.00,
        [ValidityDays] = 180,
        [ProfileViewLimit] = 20,
        [CanViewContact] = 1,
        [IsActive] = 1
    WHERE [MembershipPlanId] = 2 OR [PlanName] = 'Premium';
END
GO

-- 3. Ensure UserSubscription exists and has all approval and limit tracking columns
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'UserSubscription')
BEGIN
    CREATE TABLE [dbo].[UserSubscription](
        [SubscriptionId] [int] IDENTITY(1,1) NOT NULL,
        [UserId] [int] NOT NULL,
        [MembershipPlanId] [tinyint] NOT NULL,
        [AmountPaid] [decimal](10, 2) NOT NULL DEFAULT 0,
        [PaymentReference] [nvarchar](100) NULL,
        [ProfileViewLimit] [int] NOT NULL DEFAULT 20,
        [ProfileViewsUsed] [int] NOT NULL DEFAULT 0,
        [StartDate] [date] NOT NULL,
        [EndDate] [date] NOT NULL,
        [IsApproved] [bit] NOT NULL DEFAULT 0,
        [ApprovedAt] [datetime] NULL,
        [ApprovedBy] [int] NULL,
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_UserSubscription] PRIMARY KEY CLUSTERED ([SubscriptionId] ASC)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('UserSubscription') AND name = 'ProfileViewLimit')
        ALTER TABLE [dbo].[UserSubscription] ADD [ProfileViewLimit] [int] NOT NULL DEFAULT 20;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('UserSubscription') AND name = 'ProfileViewsUsed')
        ALTER TABLE [dbo].[UserSubscription] ADD [ProfileViewsUsed] [int] NOT NULL DEFAULT 0;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('UserSubscription') AND name = 'IsApproved')
        ALTER TABLE [dbo].[UserSubscription] ADD [IsApproved] [bit] NOT NULL DEFAULT 0;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('UserSubscription') AND name = 'ApprovedAt')
        ALTER TABLE [dbo].[UserSubscription] ADD [ApprovedAt] [datetime] NULL;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('UserSubscription') AND name = 'ApprovedBy')
        ALTER TABLE [dbo].[UserSubscription] ADD [ApprovedBy] [int] NULL;
END
GO

-- 4. Create UserProfileViewAccess table (tracks individual profiles unlocked by user)
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'UserProfileViewAccess')
BEGIN
    CREATE TABLE [dbo].[UserProfileViewAccess](
        [AccessId] [int] IDENTITY(1,1) NOT NULL,
        [ViewerUserId] [int] NOT NULL,
        [TargetUserId] [int] NOT NULL,
        [UnlockedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [IsActive] [bit] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_UserProfileViewAccess] PRIMARY KEY CLUSTERED ([AccessId] ASC),
        CONSTRAINT [UQ_Viewer_Target] UNIQUE NONCLUSTERED ([ViewerUserId], [TargetUserId])
    );
END
GO

-- 5. Stored Procedure: Submit Payment Reference for Approval
CREATE OR ALTER PROCEDURE [dbo].[usp_Subscription_SubmitPayment]
(
    @UserId INT,
    @MembershipPlanId TINYINT = 2,
    @AmountPaid DECIMAL(10,2) = 2000.00,
    @PaymentReference NVARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ValidityDays INT = 180;
    DECLARE @ProfileLimit INT = 20;

    SELECT @ValidityDays = ValidityDays, @ProfileLimit = ProfileViewLimit
    FROM [dbo].[MembershipPlanMaster]
    WHERE [MembershipPlanId] = @MembershipPlanId;

    DECLARE @StartDate DATE = CAST(GETDATE() AS DATE);
    DECLARE @EndDate DATE = DATEADD(DAY, @ValidityDays, @StartDate);

    INSERT INTO [dbo].[UserSubscription]
    (
        [UserId],
        [MembershipPlanId],
        [AmountPaid],
        [PaymentReference],
        [ProfileViewLimit],
        [ProfileViewsUsed],
        [StartDate],
        [EndDate],
        [IsApproved],
        [IsActive],
        [CreatedAt]
    )
    VALUES
    (
        @UserId,
        @MembershipPlanId,
        @AmountPaid,
        @PaymentReference,
        @ProfileLimit,
        0,
        @StartDate,
        @EndDate,
        0, -- Pending admin approval
        1,
        GETDATE()
    );

    SELECT SCOPE_IDENTITY() AS SubscriptionId, 'Payment reference submitted successfully. Awaiting admin approval.' AS Message;
END
GO

-- 6. Stored Procedure: Admin Approves Subscription
CREATE OR ALTER PROCEDURE [dbo].[usp_Subscription_Approve]
(
    @SubscriptionId INT,
    @AdminUserId INT = 1
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserId INT;
    DECLARE @MembershipPlanId TINYINT;
    DECLARE @ValidityDays INT;
    DECLARE @StartDate DATE = CAST(GETDATE() AS DATE);
    DECLARE @EndDate DATE;

    SELECT @UserId = UserId, @MembershipPlanId = MembershipPlanId
    FROM [dbo].[UserSubscription]
    WHERE [SubscriptionId] = @SubscriptionId;

    IF @UserId IS NULL
    BEGIN
        RAISERROR('Subscription not found.', 16, 1);
        RETURN;
    END

    SELECT @ValidityDays = ValidityDays
    FROM [dbo].[MembershipPlanMaster]
    WHERE [MembershipPlanId] = @MembershipPlanId;

    SET @EndDate = DATEADD(DAY, ISNULL(@ValidityDays, 180), @StartDate);

    -- Activate subscription
    UPDATE [dbo].[UserSubscription]
    SET [IsApproved] = 1,
        [ApprovedAt] = GETDATE(),
        [ApprovedBy] = @AdminUserId,
        [StartDate] = @StartDate,
        [EndDate] = @EndDate,
        [IsActive] = 1
    WHERE [SubscriptionId] = @SubscriptionId;

    -- Upgrade UserAccount to Premium
    UPDATE [dbo].[UserAccount]
    SET [IsPremium] = 1,
        [MembershipPlanId] = @MembershipPlanId,
        [UpdatedAt] = GETDATE()
    WHERE [UserId] = @UserId;

    SELECT 1 AS Success, 'Subscription approved successfully. User upgraded to Premium with 20 profile access.' AS Message;
END
GO

-- 7. Stored Procedure: Check / Unlock Profile Access
CREATE OR ALTER PROCEDURE [dbo].[usp_Profile_UnlockView]
(
    @ViewerUserId INT,
    @TargetUserId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- If viewing own profile, always permit
    IF @ViewerUserId = @TargetUserId
    BEGIN
        SELECT 1 AS CanView, 1 AS IsOwnProfile, 0 AS ProfileViewsUsed, 20 AS ProfileViewLimit;
        RETURN;
    END

    -- Check if already unlocked previously
    IF EXISTS (SELECT 1 FROM [dbo].[UserProfileViewAccess] WHERE [ViewerUserId] = @ViewerUserId AND [TargetUserId] = @TargetUserId AND [IsActive] = 1)
    BEGIN
        SELECT 1 AS CanView, 0 AS IsOwnProfile, 0 AS NewUnlockRequired;
        RETURN;
    END

    -- Check if viewer has active approved subscription with views remaining
    DECLARE @SubId INT;
    DECLARE @Limit INT;
    DECLARE @Used INT;

    SELECT TOP 1 
        @SubId = SubscriptionId,
        @Limit = ProfileViewLimit,
        @Used = ProfileViewsUsed
    FROM [dbo].[UserSubscription]
    WHERE [UserId] = @ViewerUserId
      AND [IsApproved] = 1
      AND [IsActive] = 1
      AND [EndDate] >= CAST(GETDATE() AS DATE)
    ORDER BY [EndDate] DESC;

    IF @SubId IS NOT NULL AND @Used < @Limit
    BEGIN
        -- Deduct 1 view from limit
        UPDATE [dbo].[UserSubscription]
        SET [ProfileViewsUsed] = [ProfileViewsUsed] + 1
        WHERE [SubscriptionId] = @SubId;

        -- Record unlock
        INSERT INTO [dbo].[UserProfileViewAccess] ([ViewerUserId], [TargetUserId], [UnlockedAt], [IsActive])
        VALUES (@ViewerUserId, @TargetUserId, GETDATE(), 1);

        SELECT 1 AS CanView, 0 AS IsOwnProfile, (@Used + 1) AS ProfileViewsUsed, @Limit AS ProfileViewLimit;
    END
    ELSE
    BEGIN
        -- Locked: either no subscription or limit reached
        SELECT 0 AS CanView, 0 AS IsOwnProfile, ISNULL(@Used, 0) AS ProfileViewsUsed, ISNULL(@Limit, 0) AS ProfileViewLimit;
    END
END
GO

PRINT 'Subscription & Membership setup script executed successfully.';
GO
