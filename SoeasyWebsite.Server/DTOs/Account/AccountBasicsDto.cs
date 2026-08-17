namespace SoeasyWebsite.Server.DTOs.Account;

public class AccountBasicsDto
{
    public int UserId { get; set; }

    public string ProfileCode { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string? MobileNumber { get; set; }

    public string? Email { get; set; }

    public byte? GenderId { get; set; }
}
