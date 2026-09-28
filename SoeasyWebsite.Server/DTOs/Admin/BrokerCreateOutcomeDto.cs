namespace SoeasyWebsite.Server.DTOs.Admin;

public class BrokerCreateOutcomeDto
{
    public int ResultCode { get; set; }
    public int? BrokerId { get; set; }
    public string Message { get; set; } = string.Empty;
}