namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminProfileDto
{
    public int UserId { get; set; }

    public string ProfileCode { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string? Email { get; set; }

    public byte GenderId { get; set; }

    public string? GenderName { get; set; }

    public byte ProfileStatusId { get; set; }

    public string? StatusName { get; set; }

    public bool IsActive { get; set; }

    public bool IsProfileCompleted { get; set; }

    public bool IsPremium { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime DateOfBirth { get; set; }

    public string? City { get; set; }

    public short? StateId { get; set; }

    public string? StateName { get; set; }

    public short? DistrictId { get; set; }

    public string? DistrictName { get; set; }

    public short? EducationId { get; set; }

    public string? EducationName { get; set; }

    public short? OccupationId { get; set; }

    public string? OccupationName { get; set; }

    public int? CommunityId { get; set; }

    public string? CommunityName { get; set; }

    public short? IncomeId { get; set; }

    public string? IncomeRange { get; set; }

    public string? CompanyName { get; set; }

    public string? Designation { get; set; }

    public string ProfileImageUrl { get; set; } = string.Empty;
}