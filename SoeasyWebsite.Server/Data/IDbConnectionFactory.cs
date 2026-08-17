using System.Data;

namespace SoeasyWebsite.Server.Data;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}