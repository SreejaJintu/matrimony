using SoeasyWebsite.Server.DTOs.Location;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface ILocationRepository
{
    Task<IEnumerable<StateDto>> GetStatesByCountry(short countryId);

    Task<IEnumerable<DistrictDto>> GetDistrictsByState(short stateId);

    Task<IEnumerable<LocationDto>> GetLocationsByDistrict(short districtId);

    Task<LocationOperationResultDto> AddState(AddStateRequestDto dto);

    Task<LocationOperationResultDto> AddDistrict(AddDistrictRequestDto dto);

    Task<LocationOperationResultDto> AddLocation(AddLocationRequestDto dto);
}
