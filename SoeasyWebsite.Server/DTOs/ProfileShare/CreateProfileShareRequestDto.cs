namespace SoeasyWebsite.Server.DTOs.ProfileShare;

public sealed class CreateProfileShareRequestDto
{
    public int PaidUserId { get; set; }
    public List<int> ProfileUserIds { get; set; } = [];
}
