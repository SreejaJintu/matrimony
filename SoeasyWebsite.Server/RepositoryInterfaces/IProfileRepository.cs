using SoeasyWebsite.Server.DTOs.Profile;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IProfileRepository
{
    Task<UserProfileDto?> GetByUserId(int userId, int? viewerUserId = null);

    Task<bool> UpsertProfile(UpsertProfileRequestDto dto);

    Task<bool> UpsertFamily(UpsertFamilyRequestDto dto);

    Task<bool> UpsertPreference(UpsertPreferenceRequestDto dto);

    Task<bool> SavePhoto(SaveUserPhotoRequestDto dto);
}
