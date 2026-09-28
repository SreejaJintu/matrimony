using SoeasyWebsite.Server.DTOs.Location;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class LocationService
{
    private readonly ILocationRepository _repository;

    public LocationService(ILocationRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<StateDto>> GetStatesByCountry(short countryId)
        => _repository.GetStatesByCountry(countryId);

    public Task<IEnumerable<DistrictDto>> GetDistrictsByState(short stateId)
        => _repository.GetDistrictsByState(stateId);

    public Task<IEnumerable<LocationDto>> GetLocationsByDistrict(short districtId)
        => _repository.GetLocationsByDistrict(districtId);

    public Task<LocationOperationResultDto> AddState(AddStateRequestDto dto)
        => _repository.AddState(dto);

    public Task<LocationOperationResultDto> AddDistrict(AddDistrictRequestDto dto)
        => _repository.AddDistrict(dto);

    public Task<LocationOperationResultDto> AddLocation(AddLocationRequestDto dto)
        => _repository.AddLocation(dto);
}
