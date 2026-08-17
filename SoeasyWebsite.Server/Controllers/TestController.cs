using Microsoft.AspNetCore.Mvc;
using SoeasyWebsite.Server.Data;

namespace SoeasyWebsite.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IDbConnectionFactory _connectionFactory;

    public TestController(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    [HttpGet]
    public IActionResult Get()
    {
        using var connection = _connectionFactory.CreateConnection();

        connection.Open();

        return Ok("Database Connected Successfully.");
    }
}