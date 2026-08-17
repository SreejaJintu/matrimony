namespace SoeasyWebsite.Server.DTOs.Profile;

public class SaveUserPhotoRequestDto
{
    public int UserId { get; set; }

    public string PhotoUrl { get; set; } = string.Empty;

    public bool IsProfilePhoto { get; set; }

    public int DisplayOrder { get; set; } = 1;

    public bool IsApproved { get; set; } = true;

    public bool IsActive { get; set; } = true;
}
