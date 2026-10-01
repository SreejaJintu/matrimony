using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Broker;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/broker/candidates")]
public class BrokerCandidateController : ControllerBase
{
    private readonly ICurrentBrokerService _currentBrokerService;
    private readonly IBrokerCandidateService _candidateService;

    public BrokerCandidateController(
        ICurrentBrokerService currentBrokerService,
        IBrokerCandidateService candidateService)
    {
        _currentBrokerService = currentBrokerService;
        _candidateService = candidateService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brokerId = await GetCurrentBrokerId();
        if (brokerId is null)
        {
            return Forbid();
        }

        var candidates = await _candidateService.GetAllAsync(brokerId.Value);
        return Ok(new ApiResponse<IEnumerable<BrokerCandidateDto>>
        {
            Success = true,
            Message = "Candidates retrieved successfully.",
            Data = candidates
        });
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        var brokerId = await GetCurrentBrokerId();
        if (brokerId is null)
        {
            return Forbid();
        }

        var candidate = await _candidateService.GetByUserIdAsync(brokerId.Value, userId);
        if (candidate is null)
        {
            return NotFound(new ApiResponse<BrokerCandidateDto>
            {
                Success = false,
                Message = "Candidate not found."
            });
        }

        return Ok(new ApiResponse<BrokerCandidateDto>
        {
            Success = true,
            Message = "Candidate retrieved successfully.",
            Data = candidate
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBrokerCandidateRequestDto request)
    {
        var brokerId = await GetCurrentBrokerId();
        if (brokerId is null)
        {
            return Forbid();
        }

        var candidate = await _candidateService.CreateAsync(request, brokerId.Value);
        if (candidate is null)
        {
            return Conflict(new ApiResponse<CreateBrokerCandidateResponseDto>
            {
                Success = false,
                Message = "Candidate could not be created. Mobile number or email may already exist."
            });
        }

        return Created($"/api/profile/{candidate.UserId}", new ApiResponse<CreateBrokerCandidateResponseDto>
        {
            Success = true,
            Message = "Candidate created successfully.",
            Data = candidate
        });
    }

    private async Task<int?> GetCurrentBrokerId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
        {
            return null;
        }

        return await _currentBrokerService.GetCurrentBrokerId(userId);
    }
}
