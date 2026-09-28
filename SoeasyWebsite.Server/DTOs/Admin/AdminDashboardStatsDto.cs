namespace SoeasyWebsite.Server.DTOs.Admin;

public class AdminDashboardStatsDto
{
    public int TotalProfiles { get; set; }
    public int MaleProfiles { get; set; }
    public int FemaleProfiles { get; set; }
    public int ActiveMembers { get; set; }
    public int PendingPayments { get; set; }
    public int PendingReports { get; set; }
    public int TotalLeads { get; set; }
    public List<AdminDashboardActivityDto> RecentActivities { get; set; } = new();
}

public class AdminDashboardActivityDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "profile";
    public string Icon { get; set; } = "+";
    public DateTime Timestamp { get; set; }
}
