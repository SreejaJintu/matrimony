using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Profile;

namespace SoeasyWebsite.Server.Interfaces;

public interface IProfileService
{
    Task<ApiResponse<UserProfileDto>> GetByUserId(int userId, int? viewerUserId = null);

    Task<ApiResponse<bool>> UpsertProfile(UpsertProfileRequestDto dto);

    Task<ApiResponse<bool>> UpsertFamily(UpsertFamilyRequestDto dto);

    Task<ApiResponse<bool>> UpsertPreference(UpsertPreferenceRequestDto dto);

    Task<ApiResponse<bool>> SavePhoto(SaveUserPhotoRequestDto dto);
}
