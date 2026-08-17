namespace SoeasyWebsite.Server.DTOs.Subscription;

public class MarriedRefundResultDto
{
    public bool Success { get; set; }
    public int MarriedUserId { get; set; }
    public int ProfilesRefunded { get; set; }
    public string Message { get; set; } = string.Empty;
}
