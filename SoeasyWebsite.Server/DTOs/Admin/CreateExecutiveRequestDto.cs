using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Admin;

public class CreateExecutiveRequestDto
{
    [Required, StringLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string UserName { get; set; } = string.Empty;

    [EmailAddress, StringLength(200)]
    public string? Email { get; set; }

    [StringLength(20), RegularExpression("^[0-9+() -]{7,20}$")]
    public string? MobileNumber { get; set; }

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [Required, Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}