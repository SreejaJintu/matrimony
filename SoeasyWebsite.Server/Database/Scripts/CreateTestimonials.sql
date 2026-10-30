IF OBJECT_ID(N'dbo.Testimonial', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Testimonial
    (
        TestimonialId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Testimonial PRIMARY KEY,
        CoupleNames NVARCHAR(160) NOT NULL,
        Quote NVARCHAR(1200) NOT NULL,
        MarriedOn NVARCHAR(100) NOT NULL CONSTRAINT DF_Testimonial_MarriedOn DEFAULT (N''),
        ImageData VARBINARY(MAX) NULL,
        ImageContentType NVARCHAR(100) NULL,
        DisplayOrder INT NOT NULL CONSTRAINT DF_Testimonial_DisplayOrder DEFAULT (0),
        IsActive BIT NOT NULL CONSTRAINT DF_Testimonial_IsActive DEFAULT (1),
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Testimonial_CreatedAt DEFAULT (SYSUTCDATETIME())
    );
END;
GO

IF COL_LENGTH(N'dbo.Testimonial', N'ImageData') IS NULL
    ALTER TABLE dbo.Testimonial ADD ImageData VARBINARY(MAX) NULL;
GO

IF COL_LENGTH(N'dbo.Testimonial', N'ImageContentType') IS NULL
    ALTER TABLE dbo.Testimonial ADD ImageContentType NVARCHAR(100) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Testimonial)
BEGIN
    INSERT INTO dbo.Testimonial (CoupleNames, Quote, MarriedOn, ImageData, ImageContentType, DisplayOrder, IsActive)
    VALUES
    (
        N'Athul & Divya',
        N'We found each other on Viswaas Matrimony and today we are living our happy ever after. Thank you for being a part of our journey.',
        N'Married on 12 Dec 2023',
        NULL,
        NULL,
        0,
        1
    );
END;
GO
