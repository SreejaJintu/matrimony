using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Authentication;

public class VerifyLoginOtpRequestDto
{
    [Range(1, int.MaxValue)]
    public int UserId { get; set; }

    [Required]
    public string Otp { get; set; } = string.Empty;
}
