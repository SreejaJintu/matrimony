using System.ComponentModel.DataAnnotations;

namespace SoeasyWebsite.Server.DTOs.Admin;

public class UpdateBrokerRequestDto
{
    [Required, StringLength(150)]
    public string BrokerName { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string CompanyName { get; set; } = string.Empty;

    [Required, StringLength(15), RegularExpression("^[0-9+() -]{7,15}$")]
    public string ContactNumber { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;
}