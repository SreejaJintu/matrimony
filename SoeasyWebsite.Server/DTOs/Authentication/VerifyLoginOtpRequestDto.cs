namespace SoeasyWebsite.Server.DTOs.Authentication;

public class VerifyLoginOtpRequestDto
{
    public int UserId { get; set; }
    public string Otp { get; set; } = string.Empty;
}
