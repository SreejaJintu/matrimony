namespace SoeasyWebsite.Server.DTOs.Match;

public class MatchCardDto
{
    public int UserId { get; set; }

    public string? ProfileCode { get; set; }     // NEW

    public string? FullName { get; set; }

    public int? Age { get; set; }

public string? District { get; set; }

public string? State { get; set; }
    public string? ImageUrl { get; set; }

    public string? Profession { get; set; }

    public string? Community { get; set; }

    public string? Education { get; set; }

    public string? Income { get; set; }

    public bool IsVerified { get; set; }

    public bool IsPremium { get; set; }          // NEW
}
