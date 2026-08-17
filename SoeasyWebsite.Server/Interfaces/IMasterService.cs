using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Masters;

namespace SoeasyWebsite.Server.Interfaces;

public interface IMasterService
{
    Task<ApiResponse<IEnumerable<MasterDto>>> GetHeight();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetReligion();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetCommunity(int religionId);
    Task<ApiResponse<IEnumerable<MasterDto>>> GetCountry();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetState(int countryId);
    Task<ApiResponse<IEnumerable<MasterDto>>> GetDistrict(int stateId);
    Task<ApiResponse<IEnumerable<MasterDto>>> GetEducation();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetMaritalStatus();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetMotherTongue();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetOccupation();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetIncome();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyType();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyStatus();
    Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyValue();
}
