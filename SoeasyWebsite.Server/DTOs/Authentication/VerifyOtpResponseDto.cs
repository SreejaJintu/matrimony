namespace SoeasyWebsite.Server.DTOs.Authentication;

public class VerifyOtpResponseDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public byte GenderId { get; set; }

    public string Token { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}
