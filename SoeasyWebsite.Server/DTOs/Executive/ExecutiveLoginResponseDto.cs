namespace SoeasyWebsite.Server.DTOs.Executive;

public class ExecutiveLoginResponseDto
{
    public int ExecutiveId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? MobileNumber { get; set; }
    public bool IsActive { get; set; }
    public string Token { get; set; } = string.Empty;
}
