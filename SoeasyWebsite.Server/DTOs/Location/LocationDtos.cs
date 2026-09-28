namespace SoeasyWebsite.Server.DTOs.Location;

public class StateDto
{
    public short StateId { get; set; }
    public short CountryId { get; set; }
    public string StateName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class DistrictDto
{
    public short DistrictId { get; set; }
    public short StateId { get; set; }
    public string DistrictName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class LocationDto
{
    public short LocationId { get; set; }
    public short DistrictId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class AddStateRequestDto
{
    public short CountryId { get; set; }
    public string StateName { get; set; } = string.Empty;
}

public class AddDistrictRequestDto
{
    public short StateId { get; set; }
    public string DistrictName { get; set; } = string.Empty;
}

public class AddLocationRequestDto
{
    public short DistrictId { get; set; }
    public string LocationName { get; set; } = string.Empty;
}

public class LocationOperationResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public short? StateId { get; set; }
    public short? DistrictId { get; set; }
    public short? LocationId { get; set; }
}
