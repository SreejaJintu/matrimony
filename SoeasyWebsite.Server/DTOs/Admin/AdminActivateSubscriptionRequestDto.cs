namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminActivateSubscriptionRequestDto
{
    public int UserId { get; set; }

    public byte MembershipPlanId { get; set; }

    public decimal AmountPaid { get; set; }

    public string? PaymentReference { get; set; }

    public DateTime StartDate { get; set; }
}