using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.DTOs;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/testimonials")]
public sealed class TestimonialsController : ControllerBase
{
    private readonly ITestimonialRepository _repository;
    public TestimonialsController(ITestimonialRepository repository) => _repository = repository;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive() => Ok(await _repository.GetActiveAsync());

    [HttpGet("admin")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetAll() => Ok(await _repository.GetAllAsync());

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create([FromBody] SaveTestimonialRequest request)
    {
        var validation = Validate(request);
        if (validation is not null) return BadRequest(new { message = validation });
        var id = await _repository.CreateAsync(request);
        return Created($"/api/testimonials/admin", new { testimonialId = id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(int id, [FromBody] SaveTestimonialRequest request)
    {
        if (id <= 0) return BadRequest(new { message = "A valid testimonial ID is required." });
        var validation = Validate(request);
        if (validation is not null) return BadRequest(new { message = validation });
        return await _repository.UpdateAsync(id, request) ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(int id) =>
        await _repository.DeleteAsync(id) ? NoContent() : NotFound();

    private static string? Validate(SaveTestimonialRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CoupleNames) || string.IsNullOrWhiteSpace(request.Quote))
            return "Couple names and testimonial quote are required.";
        if (request.ImageData is { Length: > 5_242_880 }) return "Images must be 5 MB or smaller.";
        if (request.ImageData is not null && request.ImageContentType is not ("image/jpeg" or "image/png" or "image/webp" or "image/gif"))
            return "Use a JPEG, PNG, WebP, or GIF image.";
        if (request.ImageData is null) request.ImageContentType = null;
        return null;
    }
}
