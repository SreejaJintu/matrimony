using SoeasyWebsite.Server.Common;
using SoeasyWebsite.Server.DTOs.Masters;
using SoeasyWebsite.Server.Interfaces;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Services;

public class MasterService : IMasterService
{
    private readonly IMasterRepository _masterRepository;

    public MasterService(IMasterRepository masterRepository)
    {
        _masterRepository = masterRepository;
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetReligion()
    {
        var data = await _masterRepository.GetReligion();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Religion master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetHeight()
    {
        var data = await _masterRepository.GetHeight();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Height master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetCommunity(int religionId)
    {
        var data = await _masterRepository.GetCommunity(religionId);
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Community master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetCountry()
    {
        var data = await _masterRepository.GetCountry();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Country master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetState(int countryId)
    {
        var data = await _masterRepository.GetState(countryId);
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "State master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetDistrict(int stateId)
    {
        var data = await _masterRepository.GetDistrict(stateId);
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "District master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetAllDistricts()
    {
        var data = await _masterRepository.GetAllDistricts();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "District master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetEducation()
    {
        var data = await _masterRepository.GetEducation();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Education master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetMaritalStatus()
    {
        var data = await _masterRepository.GetMaritalStatus();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Marital status master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetMotherTongue()
    {
        var data = await _masterRepository.GetMotherTongue();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Mother tongue master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetOccupation()
    {
        var data = await _masterRepository.GetOccupation();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Occupation master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetIncome()
    {
        var data = await _masterRepository.GetIncome();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Income master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyType()
    {
        var data = await _masterRepository.GetFamilyType();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Family type master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyStatus()
    {
        var data = await _masterRepository.GetFamilyStatus();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Family status master fetched successfully.",
            Data = data
        };
    }

    public async Task<ApiResponse<IEnumerable<MasterDto>>> GetFamilyValue()
    {
        var data = await _masterRepository.GetFamilyValue();
        return new ApiResponse<IEnumerable<MasterDto>>
        {
            Success = true,
            Message = "Family value master fetched successfully.",
            Data = data
        };
    }
}
