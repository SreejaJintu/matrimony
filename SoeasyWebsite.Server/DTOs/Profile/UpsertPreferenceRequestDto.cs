namespace SoeasyWebsite.Server.DTOs.Profile;

public class UpsertPreferenceRequestDto
{
    public int UserId { get; set; }

    public byte? AgeFrom { get; set; }

    public byte? AgeTo { get; set; }

    public short? HeightFromId { get; set; }

    public short? HeightToId { get; set; }

    public byte? MaritalStatusId { get; set; }

    public short? ReligionId { get; set; }

    public int? CommunityId { get; set; }

    public short? MotherTongueId { get; set; }

    public short? EducationId { get; set; }

    public short? OccupationId { get; set; }

    public short? IncomeId { get; set; }

    public short? CountryId { get; set; }

    public short? StateId { get; set; }

    public short? DistrictId { get; set; }

    public string? PreferredDescription { get; set; }
}
