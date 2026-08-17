namespace SoeasyWebsite.Server.DTOs.Authentication;

public class RegisterResponseDto
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? UserId { get; set; }

    public string? ProfileCode { get; set; }
}