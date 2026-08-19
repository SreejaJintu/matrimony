namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminActivateSubscriptionResultDto
{
    public bool Success { get; set; }

    public int SubscriptionId { get; set; }

    public int UserId { get; set; }

    public byte MembershipPlanId { get; set; }

    public string PlanName { get; set; } = string.Empty;

    public decimal AmountPaid { get; set; }

    public int ProfileViewLimit { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string Message { get; set; } = string.Empty;
}