using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Admin;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/executives")]
[Authorize(Policy = "AdminOnly")]
public class AdminExecutiveController : ControllerBase
{
    private readonly IAdminExecutiveService _service;

    public AdminExecutiveController(IAdminExecutiveService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool? isActive)
    {
        var executives = await _service.GetAllAsync(search, isActive);
        return Ok(new ApiResponse<IEnumerable<ExecutiveDto>>
        {
            Success = true,
            Message = "Executives retrieved successfully.",
            Data = executives
        });
    }

    [HttpGet("{executiveId:int}")]
    public async Task<IActionResult> GetById(int executiveId)
    {
        if (executiveId <= 0)
        {
            return BadRequest(new ApiResponse<ExecutiveDto>
            {
                Success = false,
                Message = "A valid Executive ID is required."
            });
        }

        var executive = await _service.GetByIdAsync(executiveId);
        if (executive is null)
        {
            return NotFound(new ApiResponse<ExecutiveDto>
            {
                Success = false,
                Message = "Executive not found."
            });
        }

        return Ok(new ApiResponse<ExecutiveDto>
        {
            Success = true,
            Message = "Executive retrieved successfully.",
            Data = executive
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExecutiveRequestDto request)
    {
        var result = await _service.CreateAsync(request);
        if (result.ResultCode == 2)
        {
            return Conflict(new ApiResponse<ExecutiveDto>
            {
                Success = false,
                Message = result.Message
            });
        }

        if (result.ResultCode != 1 || !result.ExecutiveId.HasValue)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<ExecutiveDto>
                {
                    Success = false,
                    Message = "Executive could not be created."
                });
        }

        var executive = await _service.GetByIdAsync(result.ExecutiveId.Value);
        if (executive is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<ExecutiveDto>
                {
                    Success = false,
                    Message = "Executive was created but could not be loaded."
                });
        }

        return CreatedAtAction(nameof(GetById), new { executiveId = executive.ExecutiveId },
            new ApiResponse<ExecutiveDto>
            {
                Success = true,
                Message = "Executive created successfully.",
                Data = executive
            });
    }

    [HttpPut("{executiveId:int}")]
    public async Task<IActionResult> Update(
        int executiveId,
        [FromBody] UpdateExecutiveRequestDto request)
    {
        if (executiveId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Executive ID is required."
            });
        }

        var result = await _service.UpdateAsync(executiveId, request);
        if (result.ResultCode == 2)
        {
            return Conflict(new ApiResponse<bool>
            {
                Success = false,
                Message = result.Message
            });
        }

        if (result.ResultCode == 0)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Executive not found."
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Executive updated successfully.",
            Data = true
        });
    }

    [HttpPut("{executiveId:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int executiveId,
        [FromBody] UpdateExecutiveStatusRequestDto request)
    {
        if (executiveId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "A valid Executive ID is required."
            });
        }

        var updated = await _service.UpdateStatusAsync(executiveId, request.IsActive);
        if (!updated)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Executive not found."
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Executive status updated successfully.",
            Data = true
        });
    }
}