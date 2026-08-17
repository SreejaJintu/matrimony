namespace SoeasyWebsite.Server.DTOs.Profile;

public class UpsertProfileRequestDto
{
    public int UserId { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public short? HeightId { get; set; }

    public decimal? Weight { get; set; }

    public byte? MaritalStatusId { get; set; }

    public short? MotherTongueId { get; set; }

    public short? ReligionId { get; set; }

    public int? CommunityId { get; set; }

    public short? EducationId { get; set; }

    public short? OccupationId { get; set; }

    public string? CompanyName { get; set; }

    public string? Designation { get; set; }

    public short? IncomeId { get; set; }

    public short? CountryId { get; set; }

    public short? StateId { get; set; }

    public short? DistrictId { get; set; }

    public string? Address { get; set; }

    public string? Pincode { get; set; }

    public string? AboutMe { get; set; }
}