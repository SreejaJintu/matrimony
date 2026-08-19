using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/admin/profiles")]
public class AdminProfileController : ControllerBase
{
    private readonly IAdminProfileService _service;

    public AdminProfileController(
        IAdminProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] byte? genderId = null,
        [FromQuery] byte? profileStatusId = null)
    {
        var profiles = await _service.GetAll(
            search,
            genderId,
            profileStatusId);

        return Ok(new
        {
            success = true,
            data = profiles
        });
    }
}