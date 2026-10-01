namespace SoeasyWebsite.Server.Interfaces;

public interface ICurrentBrokerService
{
    Task<int?> GetCurrentBrokerId(int userId);
}
