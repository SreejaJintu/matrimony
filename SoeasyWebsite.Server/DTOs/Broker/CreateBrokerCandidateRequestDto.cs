using System.ComponentModel.DataAnnotations;
using SoeasyWebsite.Server.DTOs.Profile;

namespace SoeasyWebsite.Server.DTOs.Broker;

public class CreateBrokerCandidateRequestDto
{
    [Required, StringLength(150, MinimumLength = 1)]
    public string FullName { get; set; } = string.Empty;

    [Required, StringLength(15, MinimumLength = 7)]
    public string MobileNumber { get; set; } = string.Empty;

    [EmailAddress, StringLength(150)]
    public string? Email { get; set; }

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [Range(1, 255)]
    public byte GenderId { get; set; }

    public UpsertProfileRequestDto? Profile { get; set; }
    public UpsertFamilyRequestDto? Family { get; set; }
    public UpsertPreferenceRequestDto? Preference { get; set; }
    public List<CreateBrokerCandidatePhotoDto> Photos { get; set; } = [];
}

public class CreateBrokerCandidatePhotoDto
{
    [Required, StringLength(500, MinimumLength = 1)]
    public string PhotoUrl { get; set; } = string.Empty;

    public bool IsProfilePhoto { get; set; }
    public int DisplayOrder { get; set; } = 1;
}
