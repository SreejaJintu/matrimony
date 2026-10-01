namespace SoeasyWebsite.Server.RepositoryInterfaces;

public interface ICurrentBrokerRepository
{
    Task<int?> GetApprovedActiveBrokerIdByUserId(int userId);
}
