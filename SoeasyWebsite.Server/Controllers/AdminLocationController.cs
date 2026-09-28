using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs.Location;
using SoeasyWebsite.Server.Services;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/locations")]
[Authorize]
public class AdminLocationController : ControllerBase
{
    private readonly LocationService _service;

    public AdminLocationController(LocationService service)
    {
        _service = service;
    }

    [HttpGet("states/{countryId:int}")]
    public async Task<IActionResult> GetStatesByCountry(short countryId)
    {
        var result = await _service.GetStatesByCountry(countryId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [HttpGet("districts/{stateId:int}")]
    public async Task<IActionResult> GetDistrictsByState(short stateId)
    {
        var result = await _service.GetDistrictsByState(stateId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [HttpGet("locations/{districtId:int}")]
    public async Task<IActionResult> GetLocationsByDistrict(short districtId)
    {
        var result = await _service.GetLocationsByDistrict(districtId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [HttpPost("states")]
    public async Task<IActionResult> AddState(
        [FromBody] AddStateRequestDto dto)
    {
        var result = await _service.AddState(dto);

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            data = result
        });
    }

    [HttpPost("districts")]
    public async Task<IActionResult> AddDistrict(
        [FromBody] AddDistrictRequestDto dto)
    {
        var result = await _service.AddDistrict(dto);

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            data = result
        });
    }

    [HttpPost("locations")]
    public async Task<IActionResult> AddLocation(
        [FromBody] AddLocationRequestDto dto)
    {
        var result = await _service.AddLocation(dto);

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            data = result
        });
    }
}
