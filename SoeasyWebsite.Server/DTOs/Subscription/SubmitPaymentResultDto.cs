namespace SoeasyWebsite.Server.DTOs.Subscription;

public class SubmitPaymentResultDto
{
    public int SubscriptionId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
