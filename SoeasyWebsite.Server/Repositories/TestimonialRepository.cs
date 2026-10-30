using Dapper;
using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.DTOs;
using SoeasyWebsite.Server.RepositoryInterfaces;

namespace SoeasyWebsite.Server.Repositories;

public sealed class TestimonialRepository : ITestimonialRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public TestimonialRepository(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;

    public async Task<IEnumerable<TestimonialDto>> GetActiveAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<TestimonialDto>(@"
            SELECT TestimonialId, CoupleNames, Quote, MarriedOn, ImageData, ImageContentType, DisplayOrder, IsActive
            FROM dbo.Testimonial
            WHERE IsActive = 1
            ORDER BY DisplayOrder, TestimonialId;");
    }

    public async Task<IEnumerable<TestimonialDto>> GetAllAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<TestimonialDto>(@"
            SELECT TestimonialId, CoupleNames, Quote, MarriedOn, ImageData, ImageContentType, DisplayOrder, IsActive
            FROM dbo.Testimonial
            ORDER BY DisplayOrder, TestimonialId;");
    }

    public async Task<int> CreateAsync(SaveTestimonialRequest request)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(@"
            INSERT INTO dbo.Testimonial (CoupleNames, Quote, MarriedOn, ImageData, ImageContentType, DisplayOrder, IsActive)
            VALUES (@CoupleNames, @Quote, @MarriedOn, @ImageData, @ImageContentType, @DisplayOrder, @IsActive);
            SELECT CAST(SCOPE_IDENTITY() AS int);", request);
    }

    public async Task<bool> UpdateAsync(int id, SaveTestimonialRequest request)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(@"
            UPDATE dbo.Testimonial
            SET CoupleNames = @CoupleNames, Quote = @Quote, MarriedOn = @MarriedOn,
                ImageData = @ImageData, ImageContentType = @ImageContentType,
                DisplayOrder = @DisplayOrder, IsActive = @IsActive
            WHERE TestimonialId = @Id;", new
        {
            Id = id, request.CoupleNames, request.Quote, request.MarriedOn,
            request.ImageData, request.ImageContentType, request.DisplayOrder, request.IsActive
        }) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM dbo.Testimonial WHERE TestimonialId = @Id;", new { Id = id }) > 0;
    }
}
