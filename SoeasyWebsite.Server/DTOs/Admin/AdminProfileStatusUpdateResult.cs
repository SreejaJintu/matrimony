namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminProfileStatusUpdateResult
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? UserId { get; set; }

    public byte? ProfileStatusId { get; set; }
}