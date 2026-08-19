using SoeasyWebsite.Server.DTOs.Profile;

namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminProfileDetailResult : UserProfileDto
{
    public string? GenderName { get; set; }

    public byte ProfileStatusId { get; set; }

    public string? StatusName { get; set; }

    public byte? MembershipPlanId { get; set; }

    public string? PlanName { get; set; }

    public bool IsMobileVerified { get; set; }

    public bool IsEmailVerified { get; set; }

    public bool IsProfileCompleted { get; set; }

    public bool IsPremium { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastLogin { get; set; }
}