using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Profile;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _profileRepository;

    public ProfileService(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task<ApiResponse<UserProfileDto>> GetByUserId(int userId, int? viewerUserId = null)
    {
        var profile = await _profileRepository.GetByUserId(userId, viewerUserId);

        if (profile is null)
        {
            return new ApiResponse<UserProfileDto>
            {
                Success = false,
                Message = "Profile not found."
            };
        }

        return new ApiResponse<UserProfileDto>
        {
            Success = true,
            Message = "Profile fetched successfully.",
            Data = profile
        };
    }

    public async Task<ApiResponse<bool>> UpsertProfile(UpsertProfileRequestDto dto)
    {
        var success = await _profileRepository.UpsertProfile(dto);
        return new ApiResponse<bool>
        {
            Success = success,
            Message = success ? "Profile saved successfully." : "Failed to save profile.",
            Data = success
        };
    }

    public async Task<ApiResponse<bool>> UpsertFamily(UpsertFamilyRequestDto dto)
    {
        var success = await _profileRepository.UpsertFamily(dto);
        return new ApiResponse<bool>
        {
            Success = success,
            Message = success ? "Family details saved successfully." : "Failed to save family details.",
            Data = success
        };
    }

    public async Task<ApiResponse<bool>> UpsertPreference(UpsertPreferenceRequestDto dto)
    {
        var success = await _profileRepository.UpsertPreference(dto);
        return new ApiResponse<bool>
        {
            Success = success,
            Message = success ? "Preferences saved successfully." : "Failed to save preferences.",
            Data = success
        };
    }

    public async Task<ApiResponse<bool>> SavePhoto(SaveUserPhotoRequestDto dto)
    {
        var success = await _profileRepository.SavePhoto(dto);
        return new ApiResponse<bool>
        {
            Success = success,
            Message = success ? "Photo saved successfully." : "Failed to save photo.",
            Data = success
        };
    }
}
