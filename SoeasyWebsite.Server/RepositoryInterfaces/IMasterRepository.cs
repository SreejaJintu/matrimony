using SoeasyWebsite.Server.DTOs.Masters;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface IMasterRepository
{
    Task<IEnumerable<MasterDto>> GetHeight();
    Task<IEnumerable<MasterDto>> GetReligion();
    Task<IEnumerable<MasterDto>> GetCommunity(int religionId);
    Task<IEnumerable<MasterDto>> GetCountry();
    Task<IEnumerable<MasterDto>> GetState(int countryId);
    Task<IEnumerable<MasterDto>> GetDistrict(int stateId);
    Task<IEnumerable<MasterDto>> GetEducation();
    Task<IEnumerable<MasterDto>> GetMaritalStatus();
    Task<IEnumerable<MasterDto>> GetMotherTongue();
    Task<IEnumerable<MasterDto>> GetOccupation();
    Task<IEnumerable<MasterDto>> GetIncome();
    Task<IEnumerable<MasterDto>> GetFamilyType();
    Task<IEnumerable<MasterDto>> GetFamilyStatus();
    Task<IEnumerable<MasterDto>> GetFamilyValue();
}
