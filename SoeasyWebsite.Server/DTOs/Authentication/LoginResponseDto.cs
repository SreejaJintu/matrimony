namespace SoeasyWebsite.Server.DTOs.Authentication;

public class LoginResponseDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public byte GenderId { get; set; }

    public string Token { get; set; } = string.Empty;
}
