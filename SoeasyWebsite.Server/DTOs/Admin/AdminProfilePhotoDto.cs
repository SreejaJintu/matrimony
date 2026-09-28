namespace SoeasyWebsite.Server.DTOs.Admin;

public sealed class AdminProfilePhotoDto
{
    public int PhotoId { get; set; }

    public string PhotoUrl { get; set; } = string.Empty;

    public bool IsProfilePhoto { get; set; }

    public int DisplayOrder { get; set; }
}