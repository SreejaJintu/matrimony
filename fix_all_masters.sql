ALTER PROCEDURE [dbo].[usp_Master_GetCommunity]
(@ReligionId SMALLINT)
AS BEGIN SET NOCOUNT ON; SELECT CommunityId AS Id, CommunityName AS Name FROM CommunityMaster WHERE ReligionId = @ReligionId AND IsActive = 1 ORDER BY CommunityName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetCountry]
AS BEGIN SET NOCOUNT ON; SELECT CountryId AS Id, CountryName AS Name FROM CountryMaster WHERE IsActive = 1 ORDER BY CountryName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetDistrict]
(@StateId SMALLINT)
AS BEGIN SET NOCOUNT ON; SELECT DistrictId AS Id, DistrictName AS Name FROM DistrictMaster WHERE StateId = @StateId AND IsActive = 1 ORDER BY DistrictName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetEducation]
AS BEGIN SET NOCOUNT ON; SELECT EducationId AS Id, EducationName AS Name FROM EducationMaster WHERE IsActive = 1 ORDER BY EducationName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetFamilyStatus]
AS BEGIN SET NOCOUNT ON; SELECT FamilyStatusId AS Id, FamilyStatusName AS Name FROM FamilyStatusMaster WHERE IsActive = 1 ORDER BY FamilyStatusName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetFamilyType]
AS BEGIN SET NOCOUNT ON; SELECT FamilyTypeId AS Id, FamilyTypeName AS Name FROM FamilyTypeMaster WHERE IsActive = 1 ORDER BY FamilyTypeName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetFamilyValue]
AS BEGIN SET NOCOUNT ON; SELECT FamilyValueId AS Id, FamilyValueName AS Name FROM FamilyValueMaster WHERE IsActive = 1 ORDER BY FamilyValueName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetHeight]
AS BEGIN SET NOCOUNT ON; SELECT HeightId AS Id, HeightName AS Name FROM HeightMaster WHERE IsActive = 1 ORDER BY HeightId; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetIncome]
AS BEGIN SET NOCOUNT ON; SELECT IncomeId AS Id, IncomeRange AS Name FROM IncomeMaster WHERE IsActive = 1 ORDER BY IncomeId; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetMaritalStatus]
AS BEGIN SET NOCOUNT ON; SELECT MaritalStatusId AS Id, MaritalStatusName AS Name FROM MaritalStatusMaster WHERE IsActive = 1 ORDER BY MaritalStatusName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetMotherTongue]
AS BEGIN SET NOCOUNT ON; SELECT MotherTongueId AS Id, MotherTongueName AS Name FROM MotherTongueMaster WHERE IsActive = 1 ORDER BY MotherTongueName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetReligion]
AS BEGIN SET NOCOUNT ON; SELECT ReligionId AS Id, ReligionName AS Name FROM ReligionMaster WHERE IsActive = 1 ORDER BY ReligionName; END
GO

ALTER PROCEDURE [dbo].[usp_Master_GetState]
(@CountryId SMALLINT)
AS BEGIN SET NOCOUNT ON; SELECT StateId AS Id, StateName AS Name FROM StateMaster WHERE CountryId = @CountryId AND IsActive = 1 ORDER BY StateName; END
GO
