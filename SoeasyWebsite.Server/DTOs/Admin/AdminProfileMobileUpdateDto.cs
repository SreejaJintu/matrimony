using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Admin;

public sealed class AdminProfileMobileUpdateDto
{
    [MaxLength(15)]
    public string? MobileNumber { get; set; }
}