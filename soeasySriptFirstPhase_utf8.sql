USE [master]
GO
/****** Object:  Database [Soesy_New2026]    Script Date: 07-08-2026 12:43:38 PM ******/
CREATE DATABASE [Soesy_New2026]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Soesy_New2026', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Soesy_New2026.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Soesy_New2026_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Soesy_New2026_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Soesy_New2026] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Soesy_New2026].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Soesy_New2026] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Soesy_New2026] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Soesy_New2026] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Soesy_New2026] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Soesy_New2026] SET ARITHABORT OFF 
GO
ALTER DATABASE [Soesy_New2026] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Soesy_New2026] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Soesy_New2026] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Soesy_New2026] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Soesy_New2026] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Soesy_New2026] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Soesy_New2026] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Soesy_New2026] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Soesy_New2026] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Soesy_New2026] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Soesy_New2026] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Soesy_New2026] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Soesy_New2026] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Soesy_New2026] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Soesy_New2026] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Soesy_New2026] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Soesy_New2026] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Soesy_New2026] SET RECOVERY FULL 
GO
ALTER DATABASE [Soesy_New2026] SET  MULTI_USER 
GO
ALTER DATABASE [Soesy_New2026] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Soesy_New2026] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Soesy_New2026] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Soesy_New2026] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Soesy_New2026] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Soesy_New2026] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Soesy_New2026', N'ON'
GO
ALTER DATABASE [Soesy_New2026] SET QUERY_STORE = ON
GO
ALTER DATABASE [Soesy_New2026] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Soesy_New2026]
GO
/****** Object:  Table [dbo].[AdminUser]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AdminUser](
	[AdminId] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](150) NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[MobileNumber] [varchar](15) NULL,
	[IsSuperAdmin] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[LastLogin] [datetime] NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AdminId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommunityMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommunityMaster](
	[CommunityId] [int] IDENTITY(1,1) NOT NULL,
	[ReligionId] [smallint] NOT NULL,
	[CommunityName] [nvarchar](150) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CommunityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CountryMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CountryMaster](
	[CountryId] [smallint] IDENTITY(1,1) NOT NULL,
	[CountryName] [nvarchar](100) NOT NULL,
	[CountryCode] [nvarchar](10) NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CountryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DistrictMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DistrictMaster](
	[DistrictId] [smallint] IDENTITY(1,1) NOT NULL,
	[StateId] [smallint] NOT NULL,
	[DistrictName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DistrictId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EducationMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EducationMaster](
	[EducationId] [smallint] IDENTITY(1,1) NOT NULL,
	[EducationName] [nvarchar](150) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EducationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FamilyStatusMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FamilyStatusMaster](
	[FamilyStatusId] [tinyint] IDENTITY(1,1) NOT NULL,
	[FamilyStatusName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FamilyStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FamilyTypeMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FamilyTypeMaster](
	[FamilyTypeId] [tinyint] IDENTITY(1,1) NOT NULL,
	[FamilyTypeName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FamilyTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FamilyValueMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FamilyValueMaster](
	[FamilyValueId] [tinyint] IDENTITY(1,1) NOT NULL,
	[FamilyValueName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FamilyValueId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GenderMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GenderMaster](
	[GenderId] [tinyint] IDENTITY(1,1) NOT NULL,
	[GenderName] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GenderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HeightMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HeightMaster](
	[HeightId] [smallint] IDENTITY(1,1) NOT NULL,
	[HeightValue] [nvarchar](20) NOT NULL,
	[HeightInCm] [smallint] NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[HeightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IncomeMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IncomeMaster](
	[IncomeId] [smallint] IDENTITY(1,1) NOT NULL,
	[IncomeRange] [nvarchar](100) NOT NULL,
	[MinIncome] [decimal](18, 2) NULL,
	[MaxIncome] [decimal](18, 2) NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IncomeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InterestStatusMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InterestStatusMaster](
	[InterestStatusId] [tinyint] IDENTITY(1,1) NOT NULL,
	[StatusName] [nvarchar](30) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[InterestStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MaritalStatusMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MaritalStatusMaster](
	[MaritalStatusId] [tinyint] IDENTITY(1,1) NOT NULL,
	[MaritalStatusName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaritalStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MembershipPlanMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MembershipPlanMaster](
	[MembershipPlanId] [tinyint] IDENTITY(1,1) NOT NULL,
	[PlanName] [nvarchar](50) NOT NULL,
	[Amount] [decimal](10, 2) NOT NULL,
	[ValidityDays] [int] NOT NULL,
	[CanViewContact] [bit] NULL,
	[CanChat] [bit] NULL,
	[UnlimitedInterest] [bit] NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[MembershipPlanId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MotherTongueMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MotherTongueMaster](
	[MotherTongueId] [smallint] IDENTITY(1,1) NOT NULL,
	[MotherTongueName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MotherTongueId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OccupationMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OccupationMaster](
	[OccupationId] [smallint] IDENTITY(1,1) NOT NULL,
	[OccupationName] [nvarchar](150) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[OccupationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProfileCreatedByMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProfileCreatedByMaster](
	[ProfileCreatedById] [tinyint] IDENTITY(1,1) NOT NULL,
	[CreatedByName] [nvarchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProfileCreatedById] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProfileStatusMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProfileStatusMaster](
	[ProfileStatusId] [tinyint] IDENTITY(1,1) NOT NULL,
	[StatusName] [nvarchar](30) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProfileStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReligionMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReligionMaster](
	[ReligionId] [smallint] IDENTITY(1,1) NOT NULL,
	[ReligionName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ReligionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StateMaster]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StateMaster](
	[StateId] [smallint] IDENTITY(1,1) NOT NULL,
	[CountryId] [smallint] NOT NULL,
	[StateName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[StateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserAccount]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserAccount](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[ProfileCode] [varchar](20) NOT NULL,
	[FullName] [nvarchar](150) NOT NULL,
	[MobileNumber] [varchar](15) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[GenderId] [tinyint] NOT NULL,
	[MembershipPlanId] [tinyint] NOT NULL,
	[ProfileStatusId] [tinyint] NOT NULL,
	[IsMobileVerified] [bit] NOT NULL,
	[IsEmailVerified] [bit] NOT NULL,
	[IsProfileCompleted] [bit] NOT NULL,
	[IsPremium] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[LastLogin] [datetime] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserFamily]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserFamily](
	[FamilyId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[FatherName] [nvarchar](150) NULL,
	[FatherOccupationId] [smallint] NULL,
	[MotherName] [nvarchar](150) NULL,
	[MotherOccupationId] [smallint] NULL,
	[FamilyTypeId] [tinyint] NULL,
	[FamilyStatusId] [tinyint] NULL,
	[FamilyValueId] [tinyint] NULL,
	[NativePlace] [nvarchar](150) NULL,
	[Brothers] [tinyint] NOT NULL,
	[MarriedBrothers] [tinyint] NOT NULL,
	[Sisters] [tinyint] NOT NULL,
	[MarriedSisters] [tinyint] NOT NULL,
	[AboutFamily] [nvarchar](max) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FamilyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserInterest]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserInterest](
	[InterestId] [int] IDENTITY(1,1) NOT NULL,
	[FromUserId] [int] NOT NULL,
	[ToUserId] [int] NOT NULL,
	[InterestStatusId] [tinyint] NOT NULL,
	[SentDate] [datetime] NOT NULL,
	[RespondedDate] [datetime] NULL,
	[Remarks] [nvarchar](250) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[InterestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserPhoto]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserPhoto](
	[PhotoId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[PhotoUrl] [nvarchar](500) NOT NULL,
	[IsProfilePhoto] [bit] NOT NULL,
	[DisplayOrder] [tinyint] NOT NULL,
	[IsApproved] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PhotoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserPreference]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserPreference](
	[PreferenceId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[AgeFrom] [tinyint] NULL,
	[AgeTo] [tinyint] NULL,
	[HeightFromId] [smallint] NULL,
	[HeightToId] [smallint] NULL,
	[MaritalStatusId] [tinyint] NULL,
	[ReligionId] [smallint] NULL,
	[CommunityId] [int] NULL,
	[MotherTongueId] [smallint] NULL,
	[EducationId] [smallint] NULL,
	[OccupationId] [smallint] NULL,
	[IncomeId] [smallint] NULL,
	[CountryId] [smallint] NULL,
	[StateId] [smallint] NULL,
	[DistrictId] [smallint] NULL,
	[PreferredDescription] [nvarchar](500) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PreferenceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserProfile]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfile](
	[ProfileId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[DateOfBirth] [date] NOT NULL,
	[HeightId] [smallint] NULL,
	[Weight] [decimal](5, 2) NULL,
	[MaritalStatusId] [tinyint] NULL,
	[MotherTongueId] [smallint] NULL,
	[ReligionId] [smallint] NULL,
	[CommunityId] [int] NULL,
	[EducationId] [smallint] NULL,
	[OccupationId] [smallint] NULL,
	[CompanyName] [nvarchar](150) NULL,
	[Designation] [nvarchar](150) NULL,
	[IncomeId] [smallint] NULL,
	[CountryId] [smallint] NULL,
	[StateId] [smallint] NULL,
	[DistrictId] [smallint] NULL,
	[Address] [nvarchar](300) NULL,
	[Pincode] [nvarchar](10) NULL,
	[AboutMe] [nvarchar](max) NULL,
	[ProfileCreatedById] [tinyint] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProfileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserSubscription]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSubscription](
	[SubscriptionId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[MembershipPlanId] [tinyint] NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[AmountPaid] [decimal](10, 2) NOT NULL,
	[PaymentReference] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SubscriptionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[CommunityMaster] ON 

INSERT [dbo].[CommunityMaster] ([CommunityId], [ReligionId], [CommunityName], [IsActive]) VALUES (1, 1, N'Brahmin', 1)
INSERT [dbo].[CommunityMaster] ([CommunityId], [ReligionId], [CommunityName], [IsActive]) VALUES (2, 1, N'Kayastha', 1)
INSERT [dbo].[CommunityMaster] ([CommunityId], [ReligionId], [CommunityName], [IsActive]) VALUES (3, 2, N'Khan', 1)
SET IDENTITY_INSERT [dbo].[CommunityMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[CountryMaster] ON 

INSERT [dbo].[CountryMaster] ([CountryId], [CountryName], [CountryCode], [IsActive]) VALUES (1, N'India', N'IN', 1)
SET IDENTITY_INSERT [dbo].[CountryMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[DistrictMaster] ON 

INSERT [dbo].[DistrictMaster] ([DistrictId], [StateId], [DistrictName], [IsActive]) VALUES (1, 1, N'Mumbai', 1)
INSERT [dbo].[DistrictMaster] ([DistrictId], [StateId], [DistrictName], [IsActive]) VALUES (2, 2, N'Bengaluru', 1)
INSERT [dbo].[DistrictMaster] ([DistrictId], [StateId], [DistrictName], [IsActive]) VALUES (3, 3, N'Hyderabad', 1)
SET IDENTITY_INSERT [dbo].[DistrictMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[EducationMaster] ON 

INSERT [dbo].[EducationMaster] ([EducationId], [EducationName], [IsActive]) VALUES (1, N'Graduate', 1)
INSERT [dbo].[EducationMaster] ([EducationId], [EducationName], [IsActive]) VALUES (2, N'Post Graduate', 1)
INSERT [dbo].[EducationMaster] ([EducationId], [EducationName], [IsActive]) VALUES (3, N'Professional Degree', 1)
SET IDENTITY_INSERT [dbo].[EducationMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[FamilyStatusMaster] ON 

INSERT [dbo].[FamilyStatusMaster] ([FamilyStatusId], [FamilyStatusName], [IsActive]) VALUES (1, N'Available', 1)
INSERT [dbo].[FamilyStatusMaster] ([FamilyStatusId], [FamilyStatusName], [IsActive]) VALUES (2, N'Settled', 1)
SET IDENTITY_INSERT [dbo].[FamilyStatusMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[FamilyTypeMaster] ON 

INSERT [dbo].[FamilyTypeMaster] ([FamilyTypeId], [FamilyTypeName], [IsActive]) VALUES (1, N'Nuclear Family', 1)
INSERT [dbo].[FamilyTypeMaster] ([FamilyTypeId], [FamilyTypeName], [IsActive]) VALUES (2, N'Joint Family', 1)
SET IDENTITY_INSERT [dbo].[FamilyTypeMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[FamilyValueMaster] ON 

INSERT [dbo].[FamilyValueMaster] ([FamilyValueId], [FamilyValueName], [IsActive]) VALUES (1, N'Traditional', 1)
INSERT [dbo].[FamilyValueMaster] ([FamilyValueId], [FamilyValueName], [IsActive]) VALUES (2, N'Moderate', 1)
INSERT [dbo].[FamilyValueMaster] ([FamilyValueId], [FamilyValueName], [IsActive]) VALUES (3, N'Liberal', 1)
SET IDENTITY_INSERT [dbo].[FamilyValueMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[GenderMaster] ON 

INSERT [dbo].[GenderMaster] ([GenderId], [GenderName], [IsActive]) VALUES (1, N'Male', 1)
INSERT [dbo].[GenderMaster] ([GenderId], [GenderName], [IsActive]) VALUES (2, N'Female', 1)
INSERT [dbo].[GenderMaster] ([GenderId], [GenderName], [IsActive]) VALUES (3, N'Other', 1)
SET IDENTITY_INSERT [dbo].[GenderMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[HeightMaster] ON 

INSERT [dbo].[HeightMaster] ([HeightId], [HeightValue], [HeightInCm], [IsActive]) VALUES (1, N'5''0"', 152, 1)
INSERT [dbo].[HeightMaster] ([HeightId], [HeightValue], [HeightInCm], [IsActive]) VALUES (2, N'5''3"', 160, 1)
INSERT [dbo].[HeightMaster] ([HeightId], [HeightValue], [HeightInCm], [IsActive]) VALUES (3, N'5''6"', 168, 1)
INSERT [dbo].[HeightMaster] ([HeightId], [HeightValue], [HeightInCm], [IsActive]) VALUES (4, N'5''9"', 175, 1)
INSERT [dbo].[HeightMaster] ([HeightId], [HeightValue], [HeightInCm], [IsActive]) VALUES (5, N'6''0"', 183, 1)
SET IDENTITY_INSERT [dbo].[HeightMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[IncomeMaster] ON 

INSERT [dbo].[IncomeMaster] ([IncomeId], [IncomeRange], [MinIncome], [MaxIncome], [IsActive]) VALUES (1, N'Up to 5 LPA', CAST(0.00 AS Decimal(18, 2)), CAST(5.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[IncomeMaster] ([IncomeId], [IncomeRange], [MinIncome], [MaxIncome], [IsActive]) VALUES (2, N'5 - 10 LPA', CAST(5.00 AS Decimal(18, 2)), CAST(10.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[IncomeMaster] ([IncomeId], [IncomeRange], [MinIncome], [MaxIncome], [IsActive]) VALUES (3, N'10 - 20 LPA', CAST(10.00 AS Decimal(18, 2)), CAST(20.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[IncomeMaster] ([IncomeId], [IncomeRange], [MinIncome], [MaxIncome], [IsActive]) VALUES (4, N'20+ LPA', CAST(20.00 AS Decimal(18, 2)), CAST(99.00 AS Decimal(18, 2)), 1)
SET IDENTITY_INSERT [dbo].[IncomeMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[InterestStatusMaster] ON 

INSERT [dbo].[InterestStatusMaster] ([InterestStatusId], [StatusName], [IsActive]) VALUES (1, N'Pending', 1)
INSERT [dbo].[InterestStatusMaster] ([InterestStatusId], [StatusName], [IsActive]) VALUES (2, N'Accepted', 1)
INSERT [dbo].[InterestStatusMaster] ([InterestStatusId], [StatusName], [IsActive]) VALUES (3, N'Rejected', 1)
INSERT [dbo].[InterestStatusMaster] ([InterestStatusId], [StatusName], [IsActive]) VALUES (4, N'Cancelled', 1)
INSERT [dbo].[InterestStatusMaster] ([InterestStatusId], [StatusName], [IsActive]) VALUES (5, N'Blocked', 1)
SET IDENTITY_INSERT [dbo].[InterestStatusMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[MaritalStatusMaster] ON 

INSERT [dbo].[MaritalStatusMaster] ([MaritalStatusId], [MaritalStatusName], [IsActive]) VALUES (1, N'Never Married', 1)
INSERT [dbo].[MaritalStatusMaster] ([MaritalStatusId], [MaritalStatusName], [IsActive]) VALUES (2, N'Divorced', 1)
INSERT [dbo].[MaritalStatusMaster] ([MaritalStatusId], [MaritalStatusName], [IsActive]) VALUES (3, N'Widowed', 1)
SET IDENTITY_INSERT [dbo].[MaritalStatusMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] ON 

INSERT [dbo].[MembershipPlanMaster] ([MembershipPlanId], [PlanName], [Amount], [ValidityDays], [CanViewContact], [CanChat], [UnlimitedInterest], [IsActive]) VALUES (1, N'Free', CAST(0.00 AS Decimal(10, 2)), 30, 0, 0, 0, 1)
INSERT [dbo].[MembershipPlanMaster] ([MembershipPlanId], [PlanName], [Amount], [ValidityDays], [CanViewContact], [CanChat], [UnlimitedInterest], [IsActive]) VALUES (2, N'Standard', CAST(999.00 AS Decimal(10, 2)), 90, 1, 1, 0, 1)
INSERT [dbo].[MembershipPlanMaster] ([MembershipPlanId], [PlanName], [Amount], [ValidityDays], [CanViewContact], [CanChat], [UnlimitedInterest], [IsActive]) VALUES (3, N'Premium', CAST(1999.00 AS Decimal(10, 2)), 180, 1, 1, 1, 1)
SET IDENTITY_INSERT [dbo].[MembershipPlanMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[MotherTongueMaster] ON 

INSERT [dbo].[MotherTongueMaster] ([MotherTongueId], [MotherTongueName], [IsActive]) VALUES (1, N'Hindi', 1)
INSERT [dbo].[MotherTongueMaster] ([MotherTongueId], [MotherTongueName], [IsActive]) VALUES (2, N'Telugu', 1)
INSERT [dbo].[MotherTongueMaster] ([MotherTongueId], [MotherTongueName], [IsActive]) VALUES (3, N'Tamil', 1)
SET IDENTITY_INSERT [dbo].[MotherTongueMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[OccupationMaster] ON 

INSERT [dbo].[OccupationMaster] ([OccupationId], [OccupationName], [IsActive]) VALUES (1, N'Engineer', 1)
INSERT [dbo].[OccupationMaster] ([OccupationId], [OccupationName], [IsActive]) VALUES (2, N'Doctor', 1)
INSERT [dbo].[OccupationMaster] ([OccupationId], [OccupationName], [IsActive]) VALUES (3, N'Business', 1)
SET IDENTITY_INSERT [dbo].[OccupationMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[ProfileCreatedByMaster] ON 

INSERT [dbo].[ProfileCreatedByMaster] ([ProfileCreatedById], [CreatedByName], [IsActive]) VALUES (1, N'Self', 1)
INSERT [dbo].[ProfileCreatedByMaster] ([ProfileCreatedById], [CreatedByName], [IsActive]) VALUES (2, N'Parent', 1)
INSERT [dbo].[ProfileCreatedByMaster] ([ProfileCreatedById], [CreatedByName], [IsActive]) VALUES (3, N'Relative', 1)
SET IDENTITY_INSERT [dbo].[ProfileCreatedByMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[ProfileStatusMaster] ON 

INSERT [dbo].[ProfileStatusMaster] ([ProfileStatusId], [StatusName], [IsActive]) VALUES (1, N'Pending', 1)
INSERT [dbo].[ProfileStatusMaster] ([ProfileStatusId], [StatusName], [IsActive]) VALUES (2, N'Approved', 1)
INSERT [dbo].[ProfileStatusMaster] ([ProfileStatusId], [StatusName], [IsActive]) VALUES (3, N'Rejected', 1)
SET IDENTITY_INSERT [dbo].[ProfileStatusMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[ReligionMaster] ON 

INSERT [dbo].[ReligionMaster] ([ReligionId], [ReligionName], [IsActive]) VALUES (1, N'Hindu', 1)
INSERT [dbo].[ReligionMaster] ([ReligionId], [ReligionName], [IsActive]) VALUES (2, N'Muslim', 1)
INSERT [dbo].[ReligionMaster] ([ReligionId], [ReligionName], [IsActive]) VALUES (3, N'Christian', 1)
SET IDENTITY_INSERT [dbo].[ReligionMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[StateMaster] ON 

INSERT [dbo].[StateMaster] ([StateId], [CountryId], [StateName], [IsActive]) VALUES (1, 1, N'Maharashtra', 1)
INSERT [dbo].[StateMaster] ([StateId], [CountryId], [StateName], [IsActive]) VALUES (2, 1, N'Karnataka', 1)
INSERT [dbo].[StateMaster] ([StateId], [CountryId], [StateName], [IsActive]) VALUES (3, 1, N'Telangana', 1)
SET IDENTITY_INSERT [dbo].[StateMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[UserAccount] ON 

INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (3, N'SM000003', N'sreeja ', N'9988776655', N'sree@qwert.com', N'$2a$11$XCUj4OWTEZbfeprIPnvbROK4hSPX/Doiat7SON6/wMt2qte4nfkQe', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-04T16:27:39.557' AS DateTime), CAST(N'2026-08-06T15:52:21.930' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (4, N'SM000004', N'Rahul Nair', N'9000000001', N'rahul@gmail.com', N'$2a$11$9QfEdrbSTNbd//hWvFhtwuZB077.hofkcjQDFVR8rqtRxg70t7MTu', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-05T16:01:19.003' AS DateTime), CAST(N'2026-08-06T14:57:24.600' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (5, N'SM000005', N'Rahul  123', N'9000000221', N'rahul.123@gmail.com', N'$2a$11$NNr4dA950Cqx7IhkHR3n5.ldwoxzlWEqDOPjOXF3tl1/kPONpSdkK', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:22.440' AS DateTime), CAST(N'2026-08-06T15:52:57.407' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (6, N'SM000006', N'Arjun Menon', N'9000000002', N'arjun.menon@gmail.com', N'$2a$11$vVJI9YwIEqMmfEUM2YRiK.OyrtxrJ6aAP4.v4azb1mTQZO22S6ie6', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:23.050' AS DateTime), CAST(N'2026-08-06T15:53:31.120' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (7, N'SM000007', N'Akash Kumar', N'9000000003', N'akash.kumar@gmail.com', N'$2a$11$4tAPYot5lLzigCDOVU1y0.OiiGam6oqQDJXa9AF5X4yk2WijHy0cG', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:23.573' AS DateTime), CAST(N'2026-08-06T15:53:58.640' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (8, N'SM000008', N'Vishnu Pillai', N'9000000004', N'vishnu.pillai@gmail.com', N'$2a$11$k8YMpOKq43d1oSroxwjG9.FYiXCNQtU1FknWb1l2Fezad3LSagMqW', 1, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:24.113' AS DateTime), CAST(N'2026-08-06T15:54:54.223' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (9, N'SM000009', N'Rohit Sharma', N'9000000005', N'rohit.sharma@gmail.com', N'$2a$11$RNSm9cmK9ODnzM6h4FkSMOrwOU98rpIhm.LXJUBu85NfbDk9Qy/PS', 1, 1, 2, 0, 0, 0, 0, 1, NULL, CAST(N'2026-08-06T11:23:24.620' AS DateTime), CAST(N'2026-08-06T14:57:24.600' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (10, N'SM000010', N'Anjali Menon', N'9000000006', N'anjali.menon@gmail.com', N'$2a$11$QBnvcCvXZp/E53XE7N72heliEZb0zp/77aq6a096jboGWOBGd5q4W', 2, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:25.110' AS DateTime), CAST(N'2026-08-06T14:57:24.600' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (11, N'SM000011', N'Meera Nair', N'9000000007', N'meera.nair@gmail.com', N'$2a$11$MbKGpbWavW.npi5vQkOkleb80evvsxX8zyH2ucTxoCleuA7hMVcEK', 2, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:25.603' AS DateTime), CAST(N'2026-08-06T15:56:01.007' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (12, N'SM000012', N'Sneha Joseph', N'9000000008', N'sneha.joseph@gmail.com', N'$2a$11$MCqDmAO8sVj7EmCOnjTnTeyJaJvW2Jr9164YFS6z1suSTjgKvb1zu', 2, 1, 2, 0, 0, 1, 0, 1, NULL, CAST(N'2026-08-06T11:23:26.100' AS DateTime), CAST(N'2026-08-06T15:56:35.963' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (13, N'SM000013', N'Aishwarya Das', N'9000000009', N'aishwarya.das@gmail.com', N'$2a$11$HpEsc2SXTsMnC/71WpwjzunrHCthcN8sbVXybiMl4tKQb2aYNEOHW', 2, 1, 2, 0, 0, 0, 0, 1, NULL, CAST(N'2026-08-06T11:23:26.567' AS DateTime), CAST(N'2026-08-06T14:57:24.600' AS DateTime))
INSERT [dbo].[UserAccount] ([UserId], [ProfileCode], [FullName], [MobileNumber], [Email], [PasswordHash], [GenderId], [MembershipPlanId], [ProfileStatusId], [IsMobileVerified], [IsEmailVerified], [IsProfileCompleted], [IsPremium], [IsActive], [LastLogin], [CreatedAt], [UpdatedAt]) VALUES (14, N'SM000014', N'Divya Krishnan', N'9000000010', N'divya.krishnan@gmail.com', N'$2a$11$Pu6INEf2iyIHTLO3gpsGl.GWNpnAIDVJu5.OUdmEWg526cedIZP/K', 2, 1, 2, 0, 0, 0, 0, 1, NULL, CAST(N'2026-08-06T11:23:27.070' AS DateTime), CAST(N'2026-08-06T14:57:24.600' AS DateTime))
SET IDENTITY_INSERT [dbo].[UserAccount] OFF
GO
SET IDENTITY_INSERT [dbo].[UserPhoto] ON 

INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (1, 3, N'https://plus.unsplash.com/premium_photo-1682089787056-9ac0c78a2ac2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZmlsbSUyMGFjdG9yc3xlbnwwfHwwfHx8MA%3D%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (2, 4, N'https://media.istockphoto.com/id/157582743/photo/young-indian.webp?a=1&b=1&s=612x612&w=0&k=20&c=6wYHtd22-klkJei_FpaQsUZhlqJUcNR0oTFPEZ8z2aw=', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (3, 5, N'https://plus.unsplash.com/premium_photo-1682092603230-1ce7cf8ca451?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZmlsbSUyMGFjdG9yc3xlbnwwfHwwfHx8MA%3D%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (4, 6, N'https://images.unsplash.com/photo-1658797508731-cf8961a3b414?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGluZGlhbiUyMGZpbG0lMjBhY3RvcnN8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (5, 7, N'https://images.unsplash.com/photo-1687102923136-05949e172cba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGluZGlhbiUyMGZpbG0lMjBhY3RvcnN8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (6, 8, N'https://images.unsplash.com/photo-1762066436595-67edb4610539?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGluZGlhbiUyMGZpbG0lMjBhY3RvcnN8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (7, 9, N'https://images.unsplash.com/photo-1762066436595-67edb4610539?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGluZGlhbiUyMGZpbG0lMjBhY3RvcnN8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (8, 10, N'https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZmlsbSUyMGFjdHJlc3N8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (9, 11, N'https://images.unsplash.com/photo-1689580298851-d4482a124290?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZmlsbSUyMGFjdHJlc3N8ZW58MHx8MHx8fDA%3D', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (10, 12, N'https://images.unsplash.com/photo-1686829375456-7e2899d63c23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMGZpbG0lMjBhY3RyZXNzfGVufDB8fDB8fHww', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (11, 13, N'https://plus.unsplash.com/premium_photo-1682092039530-584ae1d9da7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwZmlsbSUyMGFjdHJlc3N8ZW58MHx8MHx8fDA%3D.jpg', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
INSERT [dbo].[UserPhoto] ([PhotoId], [UserId], [PhotoUrl], [IsProfilePhoto], [DisplayOrder], [IsApproved], [CreatedAt], [IsActive]) VALUES (12, 14, N'https://plus.unsplash.com/premium_photo-1682096118912-c90b30e0f822?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGluZGlhbiUyMGZpbG0lMjBhY3RyZXNzfGVufDB8fDB8fHww', 1, 1, 1, CAST(N'2026-08-07T11:23:13.903' AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[UserPhoto] OFF
GO
SET IDENTITY_INSERT [dbo].[UserProfile] ON 

INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (2, 4, CAST(N'1998-05-15' AS Date), 1, CAST(68.00 AS Decimal(5, 2)), 1, 1, 1, 1, 1, 1, N'Infosys', N'Software Engineer', 1, 1, 2, 2, N'MG Road', N'560001', N'Simple and caring person.', NULL, CAST(N'2026-08-06T12:17:51.023' AS DateTime), CAST(N'2026-08-06T12:35:20.607' AS DateTime), 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (3, 10, CAST(N'1999-03-10' AS Date), 1, CAST(55.00 AS Decimal(5, 2)), 1, 1, 1, 1, 2, 2, N'ABC Hospital', N'Doctor', 1, 1, 2, 2, N'Bengaluru', N'560001', N'Looking for a caring life partner.', NULL, CAST(N'2026-08-06T14:32:38.397' AS DateTime), CAST(N'2026-08-06T14:45:18.120' AS DateTime), 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (4, 3, CAST(N'1996-07-15' AS Date), 2, CAST(56.00 AS Decimal(5, 2)), 1, 1, 1, 1, 2, 2, N'Infosys', N'Software Engineer', 2, 1, 2, 2, N'Bengaluru', N'560001', N'Simple, caring and family-oriented.', NULL, CAST(N'2026-08-06T15:52:21.913' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (5, 5, CAST(N'1995-09-20' AS Date), 4, CAST(72.00 AS Decimal(5, 2)), 1, 1, 1, 1, 2, 3, N'Own Business', N'Business Owner', 3, 1, 1, 1, N'Mumbai', N'400001', N'Entrepreneur with traditional values.', NULL, CAST(N'2026-08-06T15:52:57.403' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (6, 6, CAST(N'1997-04-10' AS Date), 3, CAST(70.00 AS Decimal(5, 2)), 1, 1, 1, 1, 3, 2, N'Aster Hospital', N'Doctor', 3, 1, 3, 3, N'Hyderabad', N'500001', N'Doctor looking for an understanding partner.', NULL, CAST(N'2026-08-06T15:53:31.117' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (7, 7, CAST(N'1996-11-11' AS Date), 5, CAST(74.00 AS Decimal(5, 2)), 1, 1, 1, 1, 1, 1, N'TCS', N'Senior Developer', 2, 1, 2, 2, N'Bengaluru', N'560010', N'Passionate about technology and travel.', NULL, CAST(N'2026-08-06T15:53:58.640' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (8, 8, CAST(N'1995-12-08' AS Date), 4, CAST(69.00 AS Decimal(5, 2)), 1, 1, 1, 1, 2, 1, N'IBM', N'System Analyst', 2, 1, 1, 1, N'Mumbai', N'400002', N'Friendly and family-loving person.', NULL, CAST(N'2026-08-06T15:54:54.223' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (9, 11, CAST(N'1998-01-15' AS Date), 2, CAST(54.00 AS Decimal(5, 2)), 1, 1, 1, 1, 3, 1, N'Microsoft', N'Software Engineer', 3, 1, 2, 2, N'Bengaluru', N'560020', N'Independent and family-oriented.', NULL, CAST(N'2026-08-06T15:56:01.000' AS DateTime), NULL, 1)
INSERT [dbo].[UserProfile] ([ProfileId], [UserId], [DateOfBirth], [HeightId], [Weight], [MaritalStatusId], [MotherTongueId], [ReligionId], [CommunityId], [EducationId], [OccupationId], [CompanyName], [Designation], [IncomeId], [CountryId], [StateId], [DistrictId], [Address], [Pincode], [AboutMe], [ProfileCreatedById], [CreatedAt], [UpdatedAt], [IsActive]) VALUES (10, 12, CAST(N'1997-10-05' AS Date), 2, CAST(53.00 AS Decimal(5, 2)), 1, 1, 1, 1, 2, 2, N'Sunrise Hospital', N'Doctor', 3, 1, 3, 3, N'Hyderabad', N'500020', N'Caring, honest and ambitious.', NULL, CAST(N'2026-08-06T15:56:35.953' AS DateTime), NULL, 1)
SET IDENTITY_INSERT [dbo].[UserProfile] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__AdminUse__C9F28456BA37FEA5]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[AdminUser] ADD UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__CountryM__E056F2011A1ED0CF]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[CountryMaster] ADD UNIQUE NONCLUSTERED 
(
	[CountryName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Educatio__AC5E79E7AD8D2D56]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[EducationMaster] ADD UNIQUE NONCLUSTERED 
(
	[EducationName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__FamilySt__CB6F5CFDD1762A78]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[FamilyStatusMaster] ADD UNIQUE NONCLUSTERED 
(
	[FamilyStatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__FamilyTy__F009075B5DB422E3]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[FamilyTypeMaster] ADD UNIQUE NONCLUSTERED 
(
	[FamilyTypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__FamilyVa__DEA9E8BAEC677843]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[FamilyValueMaster] ADD UNIQUE NONCLUSTERED 
(
	[FamilyValueName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__GenderMa__F7C177155302D531]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[GenderMaster] ADD UNIQUE NONCLUSTERED 
(
	[GenderName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Interest__05E7698A79E0DB29]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[InterestStatusMaster] ADD UNIQUE NONCLUSTERED 
(
	[StatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__MaritalS__BA58663BE94AEDBB]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[MaritalStatusMaster] ADD UNIQUE NONCLUSTERED 
(
	[MaritalStatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Membersh__46E12F9EA16DDC3D]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[MembershipPlanMaster] ADD UNIQUE NONCLUSTERED 
(
	[PlanName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__MotherTo__A7464AE5385E7126]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[MotherTongueMaster] ADD UNIQUE NONCLUSTERED 
(
	[MotherTongueName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Occupati__18376EA0E5E4CC57]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[OccupationMaster] ADD UNIQUE NONCLUSTERED 
(
	[OccupationName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__ProfileC__080A74162BAF2A9F]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[ProfileCreatedByMaster] ADD UNIQUE NONCLUSTERED 
(
	[CreatedByName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__ProfileS__05E7698A8252BC1D]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[ProfileStatusMaster] ADD UNIQUE NONCLUSTERED 
(
	[StatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Religion__C476AA40B229B396]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[ReligionMaster] ADD UNIQUE NONCLUSTERED 
(
	[ReligionName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__UserAcco__250375B1005F8B11]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserAccount] ADD UNIQUE NONCLUSTERED 
(
	[MobileNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__UserAcco__6649688A3CDCAB8E]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserAccount] ADD UNIQUE NONCLUSTERED 
(
	[ProfileCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__UserAcco__A9D10534496B345A]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserAccount] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__UserFami__1788CC4D5AA8242C]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserFamily] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserFamily_FamilyStatus]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserFamily_FamilyStatus] ON [dbo].[UserFamily]
(
	[FamilyStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserFamily_FamilyType]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserFamily_FamilyType] ON [dbo].[UserFamily]
(
	[FamilyTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserFamily_User]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserFamily_User] ON [dbo].[UserFamily]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserInterest_FromUser]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserInterest_FromUser] ON [dbo].[UserInterest]
(
	[FromUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserInterest_Status]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserInterest_Status] ON [dbo].[UserInterest]
(
	[InterestStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserInterest_ToUser]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserInterest_ToUser] ON [dbo].[UserInterest]
(
	[ToUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPhoto_User]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPhoto_User] ON [dbo].[UserPhoto]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__UserPref__1788CC4DA82FB480]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserPreference] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPreference_Community]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPreference_Community] ON [dbo].[UserPreference]
(
	[CommunityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPreference_District]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPreference_District] ON [dbo].[UserPreference]
(
	[DistrictId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPreference_Religion]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPreference_Religion] ON [dbo].[UserPreference]
(
	[ReligionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPreference_State]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPreference_State] ON [dbo].[UserPreference]
(
	[StateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserPreference_User]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserPreference_User] ON [dbo].[UserPreference]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__UserProf__1788CC4D04CA8F43]    Script Date: 07-08-2026 12:43:39 PM ******/
ALTER TABLE [dbo].[UserProfile] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserProfile_Community]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserProfile_Community] ON [dbo].[UserProfile]
(
	[CommunityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserProfile_District]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserProfile_District] ON [dbo].[UserProfile]
(
	[DistrictId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserProfile_Religion]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserProfile_Religion] ON [dbo].[UserProfile]
(
	[ReligionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserProfile_State]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserProfile_State] ON [dbo].[UserProfile]
(
	[StateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserSubscription_User]    Script Date: 07-08-2026 12:43:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserSubscription_User] ON [dbo].[UserSubscription]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AdminUser] ADD  DEFAULT ((0)) FOR [IsSuperAdmin]
GO
ALTER TABLE [dbo].[AdminUser] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[AdminUser] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CommunityMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[CountryMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[DistrictMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[EducationMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[FamilyStatusMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[FamilyTypeMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[FamilyValueMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[GenderMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[HeightMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[IncomeMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[InterestStatusMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[MaritalStatusMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[MembershipPlanMaster] ADD  DEFAULT ((0)) FOR [CanViewContact]
GO
ALTER TABLE [dbo].[MembershipPlanMaster] ADD  DEFAULT ((0)) FOR [CanChat]
GO
ALTER TABLE [dbo].[MembershipPlanMaster] ADD  DEFAULT ((0)) FOR [UnlimitedInterest]
GO
ALTER TABLE [dbo].[MembershipPlanMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[MotherTongueMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[OccupationMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ProfileCreatedByMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ProfileStatusMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ReligionMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[StateMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((1)) FOR [MembershipPlanId]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((1)) FOR [ProfileStatusId]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((0)) FOR [IsMobileVerified]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((0)) FOR [IsEmailVerified]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((0)) FOR [IsProfileCompleted]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((0)) FOR [IsPremium]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserAccount] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT ((0)) FOR [Brothers]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT ((0)) FOR [MarriedBrothers]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT ((0)) FOR [Sisters]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT ((0)) FOR [MarriedSisters]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserFamily] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserInterest] ADD  DEFAULT ((1)) FOR [InterestStatusId]
GO
ALTER TABLE [dbo].[UserInterest] ADD  DEFAULT (getdate()) FOR [SentDate]
GO
ALTER TABLE [dbo].[UserInterest] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserInterest] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserPhoto] ADD  DEFAULT ((0)) FOR [IsProfilePhoto]
GO
ALTER TABLE [dbo].[UserPhoto] ADD  DEFAULT ((1)) FOR [DisplayOrder]
GO
ALTER TABLE [dbo].[UserPhoto] ADD  DEFAULT ((1)) FOR [IsApproved]
GO
ALTER TABLE [dbo].[UserPhoto] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserPhoto] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserPreference] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserPreference] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserProfile] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserProfile] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserSubscription] ADD  DEFAULT ((0)) FOR [AmountPaid]
GO
ALTER TABLE [dbo].[UserSubscription] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[UserSubscription] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CommunityMaster]  WITH CHECK ADD  CONSTRAINT [FK_Community_Religion] FOREIGN KEY([ReligionId])
REFERENCES [dbo].[ReligionMaster] ([ReligionId])
GO
ALTER TABLE [dbo].[CommunityMaster] CHECK CONSTRAINT [FK_Community_Religion]
GO
ALTER TABLE [dbo].[DistrictMaster]  WITH CHECK ADD  CONSTRAINT [FK_District_State] FOREIGN KEY([StateId])
REFERENCES [dbo].[StateMaster] ([StateId])
GO
ALTER TABLE [dbo].[DistrictMaster] CHECK CONSTRAINT [FK_District_State]
GO
ALTER TABLE [dbo].[StateMaster]  WITH CHECK ADD  CONSTRAINT [FK_State_Country] FOREIGN KEY([CountryId])
REFERENCES [dbo].[CountryMaster] ([CountryId])
GO
ALTER TABLE [dbo].[StateMaster] CHECK CONSTRAINT [FK_State_Country]
GO
ALTER TABLE [dbo].[UserAccount]  WITH CHECK ADD  CONSTRAINT [FK_UserAccount_Gender] FOREIGN KEY([GenderId])
REFERENCES [dbo].[GenderMaster] ([GenderId])
GO
ALTER TABLE [dbo].[UserAccount] CHECK CONSTRAINT [FK_UserAccount_Gender]
GO
ALTER TABLE [dbo].[UserAccount]  WITH CHECK ADD  CONSTRAINT [FK_UserAccount_Membership] FOREIGN KEY([MembershipPlanId])
REFERENCES [dbo].[MembershipPlanMaster] ([MembershipPlanId])
GO
ALTER TABLE [dbo].[UserAccount] CHECK CONSTRAINT [FK_UserAccount_Membership]
GO
ALTER TABLE [dbo].[UserAccount]  WITH CHECK ADD  CONSTRAINT [FK_UserAccount_ProfileStatus] FOREIGN KEY([ProfileStatusId])
REFERENCES [dbo].[ProfileStatusMaster] ([ProfileStatusId])
GO
ALTER TABLE [dbo].[UserAccount] CHECK CONSTRAINT [FK_UserAccount_ProfileStatus]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_FamilyStatus] FOREIGN KEY([FamilyStatusId])
REFERENCES [dbo].[FamilyStatusMaster] ([FamilyStatusId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_FamilyStatus]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_FamilyType] FOREIGN KEY([FamilyTypeId])
REFERENCES [dbo].[FamilyTypeMaster] ([FamilyTypeId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_FamilyType]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_FamilyValue] FOREIGN KEY([FamilyValueId])
REFERENCES [dbo].[FamilyValueMaster] ([FamilyValueId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_FamilyValue]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_FatherOccupation] FOREIGN KEY([FatherOccupationId])
REFERENCES [dbo].[OccupationMaster] ([OccupationId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_FatherOccupation]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_MotherOccupation] FOREIGN KEY([MotherOccupationId])
REFERENCES [dbo].[OccupationMaster] ([OccupationId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_MotherOccupation]
GO
ALTER TABLE [dbo].[UserFamily]  WITH CHECK ADD  CONSTRAINT [FK_UserFamily_UserAccount] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserFamily] CHECK CONSTRAINT [FK_UserFamily_UserAccount]
GO
ALTER TABLE [dbo].[UserInterest]  WITH CHECK ADD  CONSTRAINT [FK_UserInterest_FromUser] FOREIGN KEY([FromUserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserInterest] CHECK CONSTRAINT [FK_UserInterest_FromUser]
GO
ALTER TABLE [dbo].[UserInterest]  WITH CHECK ADD  CONSTRAINT [FK_UserInterest_Status] FOREIGN KEY([InterestStatusId])
REFERENCES [dbo].[InterestStatusMaster] ([InterestStatusId])
GO
ALTER TABLE [dbo].[UserInterest] CHECK CONSTRAINT [FK_UserInterest_Status]
GO
ALTER TABLE [dbo].[UserInterest]  WITH CHECK ADD  CONSTRAINT [FK_UserInterest_ToUser] FOREIGN KEY([ToUserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserInterest] CHECK CONSTRAINT [FK_UserInterest_ToUser]
GO
ALTER TABLE [dbo].[UserPhoto]  WITH CHECK ADD  CONSTRAINT [FK_UserPhoto_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserPhoto] CHECK CONSTRAINT [FK_UserPhoto_User]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Community] FOREIGN KEY([CommunityId])
REFERENCES [dbo].[CommunityMaster] ([CommunityId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Community]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Country] FOREIGN KEY([CountryId])
REFERENCES [dbo].[CountryMaster] ([CountryId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Country]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_District] FOREIGN KEY([DistrictId])
REFERENCES [dbo].[DistrictMaster] ([DistrictId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_District]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Education] FOREIGN KEY([EducationId])
REFERENCES [dbo].[EducationMaster] ([EducationId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Education]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_HeightFrom] FOREIGN KEY([HeightFromId])
REFERENCES [dbo].[HeightMaster] ([HeightId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_HeightFrom]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_HeightTo] FOREIGN KEY([HeightToId])
REFERENCES [dbo].[HeightMaster] ([HeightId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_HeightTo]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Income] FOREIGN KEY([IncomeId])
REFERENCES [dbo].[IncomeMaster] ([IncomeId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Income]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_MaritalStatus] FOREIGN KEY([MaritalStatusId])
REFERENCES [dbo].[MaritalStatusMaster] ([MaritalStatusId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_MaritalStatus]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_MotherTongue] FOREIGN KEY([MotherTongueId])
REFERENCES [dbo].[MotherTongueMaster] ([MotherTongueId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_MotherTongue]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Occupation] FOREIGN KEY([OccupationId])
REFERENCES [dbo].[OccupationMaster] ([OccupationId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Occupation]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_Religion] FOREIGN KEY([ReligionId])
REFERENCES [dbo].[ReligionMaster] ([ReligionId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_Religion]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_State] FOREIGN KEY([StateId])
REFERENCES [dbo].[StateMaster] ([StateId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_State]
GO
ALTER TABLE [dbo].[UserPreference]  WITH CHECK ADD  CONSTRAINT [FK_UserPreference_UserAccount] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserPreference] CHECK CONSTRAINT [FK_UserPreference_UserAccount]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Community] FOREIGN KEY([CommunityId])
REFERENCES [dbo].[CommunityMaster] ([CommunityId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Community]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Country] FOREIGN KEY([CountryId])
REFERENCES [dbo].[CountryMaster] ([CountryId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Country]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_District] FOREIGN KEY([DistrictId])
REFERENCES [dbo].[DistrictMaster] ([DistrictId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_District]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Education] FOREIGN KEY([EducationId])
REFERENCES [dbo].[EducationMaster] ([EducationId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Education]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Height] FOREIGN KEY([HeightId])
REFERENCES [dbo].[HeightMaster] ([HeightId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Height]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Income] FOREIGN KEY([IncomeId])
REFERENCES [dbo].[IncomeMaster] ([IncomeId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Income]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_MaritalStatus] FOREIGN KEY([MaritalStatusId])
REFERENCES [dbo].[MaritalStatusMaster] ([MaritalStatusId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_MaritalStatus]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_MotherTongue] FOREIGN KEY([MotherTongueId])
REFERENCES [dbo].[MotherTongueMaster] ([MotherTongueId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_MotherTongue]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Occupation] FOREIGN KEY([OccupationId])
REFERENCES [dbo].[OccupationMaster] ([OccupationId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Occupation]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_ProfileCreatedBy] FOREIGN KEY([ProfileCreatedById])
REFERENCES [dbo].[ProfileCreatedByMaster] ([ProfileCreatedById])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_ProfileCreatedBy]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_Religion] FOREIGN KEY([ReligionId])
REFERENCES [dbo].[ReligionMaster] ([ReligionId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_Religion]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_State] FOREIGN KEY([StateId])
REFERENCES [dbo].[StateMaster] ([StateId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_State]
GO
ALTER TABLE [dbo].[UserProfile]  WITH CHECK ADD  CONSTRAINT [FK_UserProfile_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserProfile] CHECK CONSTRAINT [FK_UserProfile_User]
GO
ALTER TABLE [dbo].[UserSubscription]  WITH CHECK ADD  CONSTRAINT [FK_Subscription_Plan] FOREIGN KEY([MembershipPlanId])
REFERENCES [dbo].[MembershipPlanMaster] ([MembershipPlanId])
GO
ALTER TABLE [dbo].[UserSubscription] CHECK CONSTRAINT [FK_Subscription_Plan]
GO
ALTER TABLE [dbo].[UserSubscription]  WITH CHECK ADD  CONSTRAINT [FK_Subscription_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserAccount] ([UserId])
GO
ALTER TABLE [dbo].[UserSubscription] CHECK CONSTRAINT [FK_Subscription_User]
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetCommunity]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetCommunity]
(
    @ReligionId SMALLINT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CommunityId,
        CommunityName
    FROM CommunityMaster
    WHERE ReligionId = @ReligionId
      AND IsActive = 1
    ORDER BY CommunityName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetCountry]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetCountry]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CountryId,
        CountryName
    FROM CountryMaster
    WHERE IsActive = 1
    ORDER BY CountryName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetDistrict]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetDistrict]
(
    @StateId SMALLINT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        DistrictId,
        DistrictName
    FROM DistrictMaster
    WHERE StateId = @StateId
      AND IsActive = 1
    ORDER BY DistrictName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetEducation]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetEducation]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        EducationId,
        EducationName
    FROM EducationMaster
    WHERE IsActive = 1
    ORDER BY EducationName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetFamilyStatus]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetFamilyStatus]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        FamilyStatusId,
        FamilyStatusName
    FROM FamilyStatusMaster
    WHERE IsActive = 1;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetFamilyType]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetFamilyType]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        FamilyTypeId,
        FamilyTypeName
    FROM FamilyTypeMaster
    WHERE IsActive = 1;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetFamilyValue]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetFamilyValue]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        FamilyValueId,
        FamilyValueName
    FROM FamilyValueMaster
    WHERE IsActive = 1;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetHeight]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetHeight]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        HeightId,
        HeightValue
    FROM HeightMaster
    WHERE IsActive = 1
    ORDER BY HeightInCm;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetIncome]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetIncome]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IncomeId,
        IncomeRange
    FROM IncomeMaster
    WHERE IsActive = 1
    ORDER BY MinIncome;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetMaritalStatus]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetMaritalStatus]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        MaritalStatusId,
        MaritalStatusName
    FROM MaritalStatusMaster
    WHERE IsActive = 1
    ORDER BY MaritalStatusName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetMotherTongue]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetMotherTongue]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        MotherTongueId,
        MotherTongueName
    FROM MotherTongueMaster
    WHERE IsActive = 1
    ORDER BY MotherTongueName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetOccupation]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetOccupation]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        OccupationId,
        OccupationName
    FROM OccupationMaster
    WHERE IsActive = 1
    ORDER BY OccupationName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetProfileCreatedBy]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetProfileCreatedBy]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ProfileCreatedById,
        CreatedByName
    FROM ProfileCreatedByMaster
    WHERE IsActive = 1
    ORDER BY CreatedByName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetReligion]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[usp_Master_GetReligion]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ReligionId,
        ReligionName
    FROM ReligionMaster
    WHERE IsActive = 1
    ORDER BY ReligionName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Master_GetState]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_Master_GetState]
(
    @CountryId SMALLINT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        StateId,
        StateName
    FROM StateMaster
    WHERE CountryId = @CountryId
      AND IsActive = 1
    ORDER BY StateName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Match_Search]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[usp_Match_Search]
(
    @UserId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LoggedInGenderId INT;

    -- Get logged in user's gender
    SELECT @LoggedInGenderId = GenderId
    FROM UserAccount
    WHERE UserId = @UserId;

    -- Return opposite gender profiles
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
        UA.UserId <> @UserId
        AND UA.GenderId <> @LoggedInGenderId
        AND UA.IsActive = 1
        AND UA.IsProfileCompleted = 1
        AND UA.ProfileStatusId = 2

    ORDER BY
        UA.CreatedAt DESC;

END
GO
/****** Object:  StoredProcedure [dbo].[usp_Profile_Upsert]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_Profile_Upsert]
(
    @UserId INT,
    @DateOfBirth DATE,
    @HeightId INT,
    @Weight DECIMAL(5,2),
    @MaritalStatusId INT,
    @MotherTongueId INT,
    @ReligionId INT,
    @CommunityId INT,
    @EducationId INT,
    @OccupationId INT,
    @CompanyName NVARCHAR(150)=NULL,
    @Designation NVARCHAR(150)=NULL,
    @IncomeId INT,
    @CountryId INT,
    @StateId INT,
    @DistrictId INT,
    @Address NVARCHAR(300)=NULL,
    @Pincode NVARCHAR(20)=NULL,
    @AboutMe NVARCHAR(MAX)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM UserProfile WHERE UserId = @UserId)
    BEGIN
        UPDATE UserProfile
        SET
            DateOfBirth = @DateOfBirth,
            HeightId = @HeightId,
            Weight = @Weight,
            MaritalStatusId = @MaritalStatusId,
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
        INSERT INTO UserProfile
        (
            UserId,
            DateOfBirth,
            HeightId,
            Weight,
            MaritalStatusId,
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
    END

    ----------------------------------------------------
    -- Update UserAccount
    ----------------------------------------------------

    UPDATE UA
    SET
        UA.IsProfileCompleted = 1,
        UA.UpdatedAt = GETDATE()
    FROM UserAccount UA
    WHERE UA.UserId = @UserId;

    DECLARE @RowsUpdated INT = @@ROWCOUNT;

    SELECT
        CAST(1 AS BIT) AS Success,
        'Profile saved successfully.' AS Message,
        @RowsUpdated AS RowsUpdated;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_User_ChangePassword]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_User_ChangePassword]
(
    @UserId INT,
    @PasswordHash NVARCHAR(500)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE UserAccount
    SET
        PasswordHash=@PasswordHash,
        UpdatedAt=GETDATE()
    WHERE UserId=@UserId;

    SELECT
        1 AS Status,
        'Password Updated Successfully' AS Message;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_User_ForgotPassword]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_User_ForgotPassword]
(
    @MobileNumber VARCHAR(15)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        UserId,
        FullName,
        MobileNumber,
        Email
    FROM UserAccount
    WHERE MobileNumber=@MobileNumber
      AND IsActive=1;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_User_Login]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[usp_User_Login]
(
    @UserName NVARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        UserId,
        ProfileCode,
        FullName,
        MobileNumber,
        Email,
        PasswordHash,
        GenderId,
        MembershipPlanId,
        ProfileStatusId,
        IsActive
    FROM UserAccount
    WHERE
        MobileNumber=@UserName
        OR Email=@UserName;
END
GO
/****** Object:  StoredProcedure [dbo].[usp_User_Register]    Script Date: 07-08-2026 12:43:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[usp_User_Register]
(
    @FullName NVARCHAR(150),
    @MobileNumber VARCHAR(15),
    @Email NVARCHAR(150),
    @PasswordHash NVARCHAR(500),
    @GenderId TINYINT
)
AS
BEGIN
    SET NOCOUNT ON;

    ----------------------------------------------------------
    -- Check Mobile Number
    ----------------------------------------------------------

    IF EXISTS
    (
        SELECT 1
        FROM UserAccount
        WHERE MobileNumber = @MobileNumber
    )
    BEGIN

        SELECT
            CAST(0 AS BIT) AS Success,
            'Mobile number already exists.' AS Message,
            NULL AS UserId,
            NULL AS ProfileCode;

        RETURN;

    END

    ----------------------------------------------------------
    -- Check Email
    ----------------------------------------------------------

    IF(@Email IS NOT NULL AND @Email <> '')
    BEGIN

        IF EXISTS
        (
            SELECT 1
            FROM UserAccount
            WHERE Email = @Email
        )
        BEGIN

            SELECT
                CAST(0 AS BIT) AS Success,
                'Email already exists.' AS Message,
                NULL AS UserId,
                NULL AS ProfileCode;

            RETURN;

        END

    END

    ----------------------------------------------------------
    -- Insert User
    ----------------------------------------------------------

    INSERT INTO UserAccount
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
        @Email,
        @PasswordHash,
        @GenderId
    );

    DECLARE @UserId INT = SCOPE_IDENTITY();

    DECLARE @ProfileCode VARCHAR(20);

    SET @ProfileCode =
        'SM' + RIGHT('000000' + CAST(@UserId AS VARCHAR(6)),6);

    UPDATE UserAccount
    SET ProfileCode = @ProfileCode
    WHERE UserId = @UserId;

    ----------------------------------------------------------
    -- Success
    ----------------------------------------------------------

    SELECT
        CAST(1 AS BIT) AS Success,
        'Registration Successful.' AS Message,
        @UserId AS UserId,
        @ProfileCode AS ProfileCode;

END
GO
USE [master]
GO
ALTER DATABASE [Soesy_New2026] SET  READ_WRITE 
GO
