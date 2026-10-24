using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Authentication;

public class RegisterRequestDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string MobileNumber { get; set; } = string.Empty;

    [Required]
    public string? Email { get; set; }

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Range(1, 3)]
    public byte GenderId { get; set; }
}