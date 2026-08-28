using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MasterController : ControllerBase
{
    private readonly IMasterService _masterService;

    public MasterController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    [HttpGet("height")]
    public async Task<IActionResult> GetHeight()
        => Ok(await _masterService.GetHeight());

    [HttpGet("religion")]
    public async Task<IActionResult> GetReligion()
        => Ok(await _masterService.GetReligion());

    [HttpGet("community/{religionId:int}")]
    public async Task<IActionResult> GetCommunity(int religionId)
        => Ok(await _masterService.GetCommunity(religionId));

    [HttpGet("country")]
    public async Task<IActionResult> GetCountry()
        => Ok(await _masterService.GetCountry());

    [HttpGet("state/{countryId:int}")]
    public async Task<IActionResult> GetState(int countryId)
        => Ok(await _masterService.GetState(countryId));

    [HttpGet("district/{stateId:int}")]
    public async Task<IActionResult> GetDistrict(int stateId)
        => Ok(await _masterService.GetDistrict(stateId));

    [HttpGet("districts")]
    public async Task<IActionResult> GetDistricts()
        => Ok(await _masterService.GetAllDistricts());

    [HttpGet("education")]
    public async Task<IActionResult> GetEducation()
        => Ok(await _masterService.GetEducation());

    [HttpGet("marital-status")]
    public async Task<IActionResult> GetMaritalStatus()
        => Ok(await _masterService.GetMaritalStatus());

    [HttpGet("mother-tongue")]
    public async Task<IActionResult> GetMotherTongue()
        => Ok(await _masterService.GetMotherTongue());

    [HttpGet("occupation")]
    public async Task<IActionResult> GetOccupation()
        => Ok(await _masterService.GetOccupation());

    [HttpGet("income")]
    public async Task<IActionResult> GetIncome()
        => Ok(await _masterService.GetIncome());

    [HttpGet("family-type")]
    public async Task<IActionResult> GetFamilyType()
        => Ok(await _masterService.GetFamilyType());

    [HttpGet("family-status")]
    public async Task<IActionResult> GetFamilyStatus()
        => Ok(await _masterService.GetFamilyStatus());

    [HttpGet("family-value")]
    public async Task<IActionResult> GetFamilyValue()
        => Ok(await _masterService.GetFamilyValue());
}
