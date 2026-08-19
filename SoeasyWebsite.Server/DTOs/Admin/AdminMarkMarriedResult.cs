namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminMarkMarriedResult
{
    public bool Success { get; set; }

    public int MarriedUserId { get; set; }

    public int ProfilesRefunded { get; set; }

    public string Message { get; set; } = string.Empty;
}