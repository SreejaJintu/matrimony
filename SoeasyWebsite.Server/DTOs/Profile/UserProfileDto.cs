namespace SoeasyWebsite.Server.DTOs.Profile;

public class UserProfileDto
{
    public int UserId { get; set; }

    public string ProfileCode { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string? MobileNumber { get; set; }

    public string? Email { get; set; }

    public byte? GenderId { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public short? HeightId { get; set; }

    public string? Height { get; set; }

    public decimal? Weight { get; set; }

    public byte? MaritalStatusId { get; set; }

    public string? MaritalStatus { get; set; }

    public short? MotherTongueId { get; set; }

    public string? MotherTongue { get; set; }

    public short? ReligionId { get; set; }

    public string? Religion { get; set; }

    public int? CommunityId { get; set; }

    public string? Community { get; set; }

    public short? EducationId { get; set; }

    public string? Education { get; set; }

    public short? OccupationId { get; set; }

    public string? Occupation { get; set; }

    public string? CompanyName { get; set; }

    public string? Designation { get; set; }

    public short? IncomeId { get; set; }

    public string? Income { get; set; }

    public short? CountryId { get; set; }

    public string? Country { get; set; }

    public short? StateId { get; set; }

    public string? State { get; set; }

    public short? DistrictId { get; set; }

    public string? District { get; set; }

    public string? Address { get; set; }

    public string? Pincode { get; set; }

    public string? AboutMe { get; set; }

    public string? ImageUrl { get; set; }

    public string? FatherName { get; set; }

    public string? MotherName { get; set; }

    public byte? FamilyTypeId { get; set; }

    public string? FamilyType { get; set; }

    public byte? FamilyStatusId { get; set; }

    public string? FamilyStatus { get; set; }

    public byte? FamilyValueId { get; set; }

    public string? FamilyValue { get; set; }

    public string? NativePlace { get; set; }

    public int Brothers { get; set; }

    public int MarriedBrothers { get; set; }

    public int Sisters { get; set; }

    public int MarriedSisters { get; set; }

    public string? FamilyAbout { get; set; }

    public string? PreferredDescription { get; set; }

    public int? AgeFrom { get; set; }

    public int? AgeTo { get; set; }

    public string? HeightFrom { get; set; }

    public string? HeightTo { get; set; }

    public string? PreferredReligion { get; set; }

    public string? PreferredCommunity { get; set; }

    public string? PreferredEducation { get; set; }

    public string? PreferredOccupation { get; set; }

    public string? PreferredIncome { get; set; }

    public bool CanViewFullProfile { get; set; } = true;

    public bool IsLocked { get; set; } = false;
}
