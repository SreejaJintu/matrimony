namespace SoeasyWebsite.Server.DTOs.Account;

public class UpsertAccountBasicsRequestDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? MobileNumber { get; set; }

    public string? Email { get; set; }

    public byte? GenderId { get; set; }

    public DateTime? DateOfBirth { get; set; }
}
