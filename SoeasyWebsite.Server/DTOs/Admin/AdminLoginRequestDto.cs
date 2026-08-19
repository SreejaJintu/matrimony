namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminLoginRequestDto
{
    public string UserName { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}