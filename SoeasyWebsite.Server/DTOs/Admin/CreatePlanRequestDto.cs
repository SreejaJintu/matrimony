namespace SoeasyWebsite.Server.DTOs.Admin;

public class CreatePlanRequestDto
{
    public string PlanName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public short ValidityDays { get; set; }
    public bool CanViewContact { get; set; }
    public bool CanChat { get; set; }
    public bool UnlimitedInterest { get; set; }
    public bool IsActive { get; set; } = true;
    public short ProfileViewCredits { get; set; }
    public short ProfileViewLimit { get; set; }
}