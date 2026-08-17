ALTER PROCEDURE [dbo].[usp_Master_GetOccupation]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        OccupationId AS Id,
        OccupationName AS Name
    FROM OccupationMaster
    WHERE IsActive = 1
    ORDER BY OccupationName;
END
GO
