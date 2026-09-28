using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public class AdminDashboardRepository : IAdminDashboardRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AdminDashboardRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStats()
    {
        using var connection = _connectionFactory.CreateConnection();

        const string statsSql = @"
            SELECT
                (SELECT COUNT(*) FROM dbo.UserAccount) AS TotalProfiles,
                (SELECT COUNT(*) FROM dbo.UserAccount WHERE GenderId = 1) AS MaleProfiles,
                (SELECT COUNT(*) FROM dbo.UserAccount WHERE GenderId = 2) AS FemaleProfiles,
                (SELECT COUNT(*) FROM dbo.UserAccount WHERE IsPremium = 1 OR EXISTS (SELECT 1 FROM dbo.UserSubscription us WHERE us.UserId = dbo.UserAccount.UserId AND us.IsActive = 1 AND us.IsApproved = 1)) AS ActiveMembers,
                (SELECT COUNT(*) FROM dbo.UserSubscription WHERE IsApproved = 0) AS PendingPayments,
                (SELECT COUNT(*) FROM dbo.ProfileStatusReport WHERE ReviewedByUserId IS NULL) AS PendingReports,
                (SELECT COUNT(*) FROM dbo.Lead) AS TotalLeads;

            SELECT TOP 6
                UserId,
                FullName,
                ProfileCode,
                GenderId,
                CreatedAt
            FROM dbo.UserAccount
            ORDER BY CreatedAt DESC;
        ";

        using var multi = await connection.QueryMultipleAsync(statsSql);
        var stats = await multi.ReadFirstOrDefaultAsync<AdminDashboardStatsDto>() ?? new AdminDashboardStatsDto();
        var recentUsers = await multi.ReadAsync<dynamic>();

        stats.RecentActivities = recentUsers.Select(u => new AdminDashboardActivityDto
        {
            Id = (int)u.UserId,
            Title = "New profile registered",
            Description = $"{u.FullName} ({u.ProfileCode}) registered",
            Type = "profile",
            Icon = "+",
            Timestamp = (DateTime)u.CreatedAt
        }).ToList();

        return stats;
    }
}
