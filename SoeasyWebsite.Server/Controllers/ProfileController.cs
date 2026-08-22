using FluentFTP;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Profile;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private const string AssetsBaseUrl = "https://assetsmatrimony.kaliweb.in/uploads";
    private readonly IProfileService _profileService;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(
        IProfileService profileService,
        ISubscriptionRepository subscriptionRepository,
        IConfiguration configuration,
        IWebHostEnvironment env,
        ILogger<ProfileController> logger)
    {
        _profileService = profileService;
        _subscriptionRepository = subscriptionRepository;
        _configuration = configuration;
        _env = env;
        _logger = logger;
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetByUserId(int userId, [FromQuery] int? viewerUserId = null)
    {
        // Enforce credit check & subscription authorization if viewerUserId is provided
        if (viewerUserId.HasValue)
        {
            var checkResult = await _subscriptionRepository.CheckAndDeductProfileView(viewerUserId.Value, userId);

            if (!checkResult.CanView)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new ApiResponse<string>
                {
                    Success = false,
                    Message = checkResult.Message
                });
            }
        }

        var response = await _profileService.GetByUserId(userId, viewerUserId);
        return Ok(response);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpsertProfile([FromBody] UpsertProfileRequestDto dto)
    {
        if (dto.UserId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "UserId is required."
            });
        }

        _logger.LogInformation(
            "Profile upsert received for UserId={UserId}, HeightId={HeightId}, Weight={Weight}, MaritalStatusId={MaritalStatusId}, MotherTongueId={MotherTongueId}, ReligionId={ReligionId}, CommunityId={CommunityId}, EducationId={EducationId}, OccupationId={OccupationId}, IncomeId={IncomeId}, CountryId={CountryId}, StateId={StateId}, DistrictId={DistrictId}",
            dto.UserId,
            dto.HeightId,
            dto.Weight,
            dto.MaritalStatusId,
            dto.MotherTongueId,
            dto.ReligionId,
            dto.CommunityId,
            dto.EducationId,
            dto.OccupationId,
            dto.IncomeId,
            dto.CountryId,
            dto.StateId,
            dto.DistrictId);

        var response = await _profileService.UpsertProfile(dto);
        return Ok(response);
    }

    [HttpPut("family")]
    public async Task<IActionResult> UpsertFamily([FromBody] UpsertFamilyRequestDto dto)
    {
        var response = await _profileService.UpsertFamily(dto);
        return Ok(response);
    }

    [HttpPut("preference")]
    public async Task<IActionResult> UpsertPreference([FromBody] UpsertPreferenceRequestDto dto)
    {
        var response = await _profileService.UpsertPreference(dto);
        return Ok(response);
    }

    [HttpPost("photo")]
    public async Task<IActionResult> SavePhoto([FromBody] SaveUserPhotoRequestDto dto)
    {
        if (dto.UserId <= 0)
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "UserId is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.PhotoUrl))
        {
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "PhotoUrl is required."
            });
        }

        dto.PhotoUrl = NormalizePhotoUrl(dto.PhotoUrl);
        var response = await _profileService.SavePhoto(dto);
        return Ok(response);
    }

    [HttpPost("upload-photo")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB max
    public async Task<IActionResult> UploadPhoto(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new ApiResponse<string> { Success = false, Message = "No file received." });

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Only JPG, PNG, GIF and WebP images are allowed." });

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new ApiResponse<string> { Success = false, Message = "File size must be under 5MB." });

            // Generate a unique filename
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext)) ext = ".jpg";
            var fileName = $"{Guid.NewGuid()}{ext}";

            var useFtp = _configuration.GetValue<bool>("PhotoUpload:UseFtp");
            if (useFtp)
            {
                var ftpHost = _configuration["PhotoUpload:FtpHost"] ?? "assetsmatrimony.kaliweb.in";
                var ftpUser = _configuration["PhotoUpload:FtpUsername"] ?? "";
                var ftpPass = _configuration["PhotoUpload:FtpPassword"] ?? "";
                var ftpPort = _configuration.GetValue<int>("PhotoUpload:FtpPort", 21);
                var ftpRemotePath = (_configuration["PhotoUpload:FtpRemotePath"] ?? "").Trim().TrimEnd('/');
                var baseUrl = _configuration["PhotoUpload:BaseUrl"] ?? "https://assetsmatrimony.kaliweb.in";

                var remoteFilePath = string.IsNullOrEmpty(ftpRemotePath) || ftpRemotePath == "/"
                    ? $"/{fileName}"
                    : $"{ftpRemotePath}/{fileName}";

                using var ftpClient = new AsyncFtpClient(ftpHost, ftpUser, ftpPass, ftpPort);
                await ftpClient.AutoConnect();

                await using var uploadStream = file.OpenReadStream();
                var status = await ftpClient.UploadStream(uploadStream, remoteFilePath, FtpRemoteExists.Overwrite, createRemoteDir: true);
                await ftpClient.Disconnect();

                if (status != FtpStatus.Success)
                {
                    return StatusCode(500, new ApiResponse<string>
                    {
                        Success = false,
                        Message = $"FTP upload failed with status: {status}"
                    });
                }

                var publicUrl = $"{baseUrl.TrimEnd('/')}/{fileName}";

                return Ok(new ApiResponse<string>
                {
                    Success = true,
                    Message = "Photo uploaded successfully via FTP.",
                    Data = publicUrl
                });
            }

            // Fallback: Local disk storage
            var storagePathConfig = _configuration["PhotoUpload:StoragePath"];
            string storagePath;
            if (string.IsNullOrEmpty(storagePathConfig))
            {
                storagePath = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            }
            else if (Path.IsPathRooted(storagePathConfig))
            {
                storagePath = storagePathConfig;
            }
            else
            {
                storagePath = Path.Combine(_env.ContentRootPath, storagePathConfig);
            }

            var localBaseUrl = NormalizeUploadBaseUrl(
                _configuration["PhotoUpload:BaseUrl"],
                AssetsBaseUrl);

            // Ensure directory exists
            Directory.CreateDirectory(storagePath);

            var filePath = Path.Combine(storagePath, fileName);

            // Save file to disk
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var localPublicUrl = $"{localBaseUrl.TrimEnd('/')}/{fileName}";

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Photo uploaded successfully.",
                Data = localPublicUrl
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>
            {
                Success = false,
                Message = $"Internal server error during upload: {ex.Message}",
                Data = ex.ToString()
            });
        }
    }

    private static string NormalizeUploadBaseUrl(string? configuredBaseUrl, string fallbackBaseUrl)
    {
        var baseUrl = string.IsNullOrWhiteSpace(configuredBaseUrl) ? fallbackBaseUrl : configuredBaseUrl;

        if (baseUrl.Contains("localhost", StringComparison.OrdinalIgnoreCase))
        {
            return fallbackBaseUrl;
        }

        return baseUrl.TrimEnd('/');
    }

    private static string NormalizePhotoUrl(string photoUrl)
    {
        if (photoUrl.Contains("localhost", StringComparison.OrdinalIgnoreCase))
        {
            return photoUrl
                .Replace("http://localhost:5040/uploads", AssetsBaseUrl, StringComparison.OrdinalIgnoreCase)
                .Replace("https://localhost:5040/uploads", AssetsBaseUrl, StringComparison.OrdinalIgnoreCase)
                .Replace("http://localhost:5040", "https://assetsmatrimony.kaliweb.in", StringComparison.OrdinalIgnoreCase)
                .Replace("https://localhost:5040", "https://assetsmatrimony.kaliweb.in", StringComparison.OrdinalIgnoreCase);
        }

        return photoUrl;
    }
}
