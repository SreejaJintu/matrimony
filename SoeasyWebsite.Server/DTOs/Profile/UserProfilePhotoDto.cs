namespace SoeasyWebsite.Server.DTOs.Profile;

public sealed class UserProfilePhotoDto
{
    public int PhotoId { get; set; }
    public string PhotoUrl { get; set; } = string.Empty;
    public bool IsProfilePhoto { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsApproved { get; set; }
    public bool IsActive { get; set; }
}
