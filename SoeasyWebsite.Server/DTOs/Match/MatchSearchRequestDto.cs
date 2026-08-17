namespace SoeasyWebsite.Server.DTOs.Match;

public class MatchSearchRequestDto
{
    public int? UserId { get; set; }
    public int? GenderId { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public int? HeightId { get; set; }
    public int? ReligionId { get; set; }
    public int? CommunityId { get; set; }
    public int? EducationId { get; set; }
    public int? OccupationId { get; set; }
    public int? IncomeId { get; set; }
    public int? CountryId { get; set; }
    public int? StateId { get; set; }
    public int? DistrictId { get; set; }
    public bool? OnlyVerified { get; set; }
    public string? SearchText { get; set; }
}
