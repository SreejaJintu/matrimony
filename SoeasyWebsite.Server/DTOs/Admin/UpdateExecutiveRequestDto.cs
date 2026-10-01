using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Admin;

public class UpdateExecutiveRequestDto
{
    [Required, StringLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string UserName { get; set; } = string.Empty;

    [EmailAddress, StringLength(200)]
    public string? Email { get; set; }

    [StringLength(20), RegularExpression("^[0-9+() -]{7,20}$")]
    public string? MobileNumber { get; set; }
}