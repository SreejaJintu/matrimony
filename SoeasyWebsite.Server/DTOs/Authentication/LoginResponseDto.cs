namespace SoeasyWebsite.Server.DTOs.Authentication;

public class LoginResponseDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? MobileNumber { get; set; }

    public byte GenderId { get; set; }

    public string Token { get; set; } = string.Empty;

    // True only when the user has an active and approved BrokerProfile
    public bool IsBroker { get; set; }

    // True when a normal member must complete OTP verification
    public bool RequiresOtp { get; set; }

    public string Message { get; set; } = string.Empty;
}