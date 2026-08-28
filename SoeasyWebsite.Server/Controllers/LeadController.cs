using Dapper;
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

    [HttpGet("all")]
    public async Task<IActionResult> GetAllLeads()
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            SELECT LeadId, UserId, Name, MobileNumber, Email, PreferredPlan, Status, CreatedAt
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

    [HttpPut("{leadId:int}/status")]
    public async Task<IActionResult> UpdateLeadStatus(
        [FromRoute] int leadId,
        [FromBody] UpdateLeadStatusRequestDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = @"
            UPDATE dbo.Lead
            SET Status = @Status
            WHERE LeadId = @LeadId;";

        var rows = await connection.ExecuteAsync(sql, new
        {
            LeadId = leadId,
            dto.Status
        });

        return Ok(new ApiResponse<bool>
        {
            Success = rows > 0,
            Message = rows > 0 ? "Lead status updated successfully." : "Lead not found.",
            Data = rows > 0
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
}
