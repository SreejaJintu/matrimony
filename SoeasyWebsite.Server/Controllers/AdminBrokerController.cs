using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/brokers")]
[Authorize(Policy = "AdminOnly")]
public class AdminBrokerController : ControllerBase
{
    private readonly IAdminBrokerService _service;

    public AdminBrokerController(IAdminBrokerService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBrokers()
    {
        var brokers = await _service.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<BrokerDto>>
        {
            Success = true,
            Message = "Brokers retrieved successfully.",
            Data = brokers
        });
    }

    [HttpGet("{brokerId:int}")]
    public async Task<IActionResult> GetBrokerById(int brokerId)
    {
        var broker = await _service.GetByIdAsync(brokerId);
        if (broker is null)
        {
            return NotFound(new ApiResponse<BrokerDto>
            {
                Success = false,
                Message = "Broker not found."
            });
        }

        return Ok(new ApiResponse<BrokerDto>
        {
            Success = true,
            Message = "Broker retrieved successfully.",
            Data = broker
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateBroker([FromBody] CreateBrokerRequestDto request)
    {
        var adminIdValue = User.FindFirstValue("adminId");
        if (!int.TryParse(adminIdValue, out var adminId) || adminId <= 0)
        {
            return Unauthorized(new ApiResponse<BrokerDto>
            {
                Success = false,
                Message = "The authenticated Admin ID is unavailable."
            });
        }

        var result = await _service.CreateAsync(request, adminId);
        if (result.ResultCode != 1)
        {
            return Conflict(new ApiResponse<BrokerDto>
            {
                Success = false,
                Message = result.Message
            });
        }

        if (result.Broker is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<BrokerDto>
                {
                    Success = false,
                    Message = "Broker was created but could not be loaded."
                });
        }

        return CreatedAtAction(nameof(GetBrokerById), new { brokerId = result.Broker.BrokerId }, new ApiResponse<BrokerDto>
        {
            Success = true,
            Message = "Broker registered successfully.",
            Data = result.Broker
        });
    }

    [HttpPut("{brokerId:int}")]
    public async Task<IActionResult> UpdateBroker(int brokerId, [FromBody] UpdateBrokerRequestDto request)
    {
        if (brokerId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Broker ID is required."
            });
        }

        var updated = await _service.UpdateAsync(brokerId, request);
        if (!updated)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Broker not found."
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Broker updated successfully.",
            Data = true
        });
    }

    [HttpDelete("{brokerId:int}")]
    public async Task<IActionResult> DeactivateBroker(int brokerId)
    {
        if (brokerId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Broker ID is required."
            });
        }

        var deactivated = await _service.DeactivateAsync(brokerId);
        if (!deactivated)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Active Broker not found."
            });
        }

        return NoContent();
    }

    [HttpPut("{brokerId:int}/approval")]
    public async Task<IActionResult> UpdateApproval(
        int brokerId,
        [FromBody] UpdateBrokerApprovalRequestDto request)
    {
        if (brokerId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Broker ID is required."
            });
        }

        var adminIdValue = User.FindFirstValue("adminId");
        if (!int.TryParse(adminIdValue, out var adminId) || adminId <= 0)
        {
            return Unauthorized(new ApiResponse<bool>
            {
                Success = false,
                Message = "The authenticated Admin ID is unavailable."
            });
        }

        var updated = await _service.UpdateApprovalAsync(brokerId, request.IsApproved, adminId);
        if (!updated)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Active Broker not found."
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = request.IsApproved ? "Broker approved successfully." : "Broker approval revoked.",
            Data = true
        });
    }
}