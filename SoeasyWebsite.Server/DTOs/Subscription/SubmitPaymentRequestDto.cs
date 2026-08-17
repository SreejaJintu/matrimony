namespace SoeasyWebsite.Server.DTOs.Subscription;

public class SubmitPaymentRequestDto
{
    public int UserId { get; set; }
    public string PaymentReference { get; set; } = string.Empty;
    public byte MembershipPlanId { get; set; } = 3; // Default: Premium
    public decimal AmountPaid { get; set; } = 1999.00m;
}
