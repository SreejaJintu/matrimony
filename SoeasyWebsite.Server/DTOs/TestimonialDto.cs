namespace SoeasyWebsite.Server.DTOs;

public sealed class TestimonialDto
{
    public int TestimonialId { get; set; }
    public string CoupleNames { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string MarriedOn { get; set; } = string.Empty;
    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public sealed class SaveTestimonialRequest
{
    public string CoupleNames { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string MarriedOn { get; set; } = string.Empty;
    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
