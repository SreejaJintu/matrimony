using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.Data;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/lead")]
public class LeadController : ControllerBase
{
    private readonly IDbConnectionFactory _connectionFactory;

    public LeadController(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLead([FromBody] CreateLeadRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.MobileNumber))
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "Name and Mobile Number are required."
            });
        }

        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            INSERT INTO dbo.Lead (UserId, Name, MobileNumber, Email, PreferredPlan, Status, CreatedAt)
            VALUES (@UserId, @Name, @MobileNumber, @Email, @PreferredPlan, @Status, GETDATE());";

        var rows = await connection.ExecuteAsync(sql, new
        {
            dto.UserId,
            dto.Name,
            dto.MobileNumber,
            dto.Email,
            dto.PreferredPlan,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "New" : dto.Status
        });

        return Ok(new ApiResponse<bool>
        {
            Success = rows > 0,
            Message = rows > 0 ? "Lead created successfully." : "Failed to create lead.",
            Data = rows > 0
        });
    }

    [Authorize(Policy = "LeadAccess")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllLeads()
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            SELECT LeadId, UserId, Name, MobileNumber, Email, PreferredPlan, Status, CreatedAt, Notes, FollowUpDate
            FROM dbo.Lead
            ORDER BY CreatedAt DESC;";

        var leads = await connection.QueryAsync<LeadDto>(sql);

        return Ok(new ApiResponse<IEnumerable<LeadDto>>
        {
            Success = true,
            Message = "Leads retrieved successfully.",
            Data = leads
        });
    }

    [Authorize(Policy = "LeadAccess")]
    [HttpPut("{leadId:int}/status")]
    public async Task<IActionResult> UpdateLeadStatus(
        [FromRoute] int leadId,
        [FromBody] UpdateLeadStatusRequestDto dto)
    {
        if (leadId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Lead ID is required."
            });
        }

        var status = dto.Status?.Trim();
        if (string.IsNullOrWhiteSpace(status) || !LeadStatuses.All.Contains(status, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "Status must be New, Called, Follow Up, Paid, or Cancelled."
            });
        }

        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            UPDATE dbo.Lead
            SET Status = @Status,
                Notes = @Notes,
                FollowUpDate = @FollowUpDate
            WHERE LeadId = @LeadId;";

        var rows = await connection.ExecuteAsync(sql, new
        {
            LeadId = leadId,
            Status = LeadStatuses.All.First(value => string.Equals(value, status, StringComparison.OrdinalIgnoreCase)),
            dto.Notes,
            dto.FollowUpDate
        });

        if (rows == 0)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Lead not found."
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Lead updated successfully.",
            Data = true
        });
    }
}

public class CreateLeadRequestDto
{
    public int? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PreferredPlan { get; set; } = string.Empty;
    public string? Status { get; set; }
}

public class UpdateLeadStatusRequestDto
{
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? FollowUpDate { get; set; }
}

public class LeadDto
{
    public int LeadId { get; set; }
    public int? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PreferredPlan { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? Notes { get; set; }
    public DateTime? FollowUpDate { get; set; }
}

internal static class LeadStatuses
{
    public static readonly string[] All = { "New", "Called", "Follow Up", "Paid", "Cancelled" };
}
