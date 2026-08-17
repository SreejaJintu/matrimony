namespace SoeasyWebsite.Server.DTOs.Subscription;

public class SubscriptionStatusDto
{
    public int UserId { get; set; }
    public bool IsFemaleFree { get; set; }
    public bool HasFullAccess { get; set; }
    public bool IsApproved { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public int ProfileViewLimit { get; set; }
    public int ProfileViewsUsed { get; set; }
    public int RemainingCredits { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? SubscriptionId { get; set; }
}
