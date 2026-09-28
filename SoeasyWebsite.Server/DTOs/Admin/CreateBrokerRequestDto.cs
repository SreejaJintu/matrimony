using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Admin;

public class CreateBrokerRequestDto
{
    [Required, StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required, StringLength(15), RegularExpression("^[0-9+() -]{7,15}$")]
    public string MobileNumber { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string AccountEmail { get; set; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [Range(1, 255)]
    public byte GenderId { get; set; }

    [Required, StringLength(150)]
    public string BrokerName { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string CompanyName { get; set; } = string.Empty;

}