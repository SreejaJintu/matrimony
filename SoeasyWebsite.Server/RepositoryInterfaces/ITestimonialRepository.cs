using SoeasyWebsite.Server.DTOs;

namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface ITestimonialRepository
{
    Task<IEnumerable<TestimonialDto>> GetActiveAsync();
    Task<IEnumerable<TestimonialDto>> GetAllAsync();
    Task<int> CreateAsync(SaveTestimonialRequest request);
    Task<bool> UpdateAsync(int id, SaveTestimonialRequest request);
    Task<bool> DeleteAsync(int id);
}
