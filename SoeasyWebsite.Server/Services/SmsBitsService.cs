using System.Net;
using System.Net.Http;
using SoeasyWebsite.Server.Interfaces;

namespace SoeasyWebsite.Server.Services;

public class SmsBitsService : ISmsBitsService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public SmsBitsService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<(bool Success, string Response)> SendOtpAsync(
        string phoneNumber,
        string otp)
    {
        try
        {
            var apiId = _configuration["SmsBits:ApiId"];
            var senderId = _configuration["SmsBits:SenderId"];
            var templateId = _configuration["SmsBits:TemplateId"];

            if (string.IsNullOrWhiteSpace(apiId))
                return (false, "SmsBits ApiId is not configured.");

            if (string.IsNullOrWhiteSpace(senderId))
                return (false, "SmsBits SenderId is not configured.");

            if (string.IsNullOrWhiteSpace(templateId))
                return (false, "SmsBits TemplateId is not configured.");

            if (string.IsNullOrWhiteSpace(phoneNumber))
                return (false, "Phone number is empty.");

            if (string.IsNullOrWhiteSpace(otp))
                return (false, "OTP is empty.");

            // IMPORTANT:
            // This message must exactly match your approved DLT template.
// Must exactly match the approved DLT template
var message = $"Dear Customer, Your OTP is {otp} for Viswaas by CNTSMS";
            var url =
                "https://user.smsbits.com/api/trans" +
                $"?id={Uri.EscapeDataString(apiId)}" +
                $"&to={Uri.EscapeDataString(phoneNumber)}" +
                $"&senderid={Uri.EscapeDataString(senderId)}" +
                $"&template={Uri.EscapeDataString(message)}" +
                $"&tempid={Uri.EscapeDataString(templateId)}";

            using var response = await _httpClient.GetAsync(url);

            var responseBody = await response.Content.ReadAsStringAsync();

            return (
                response.IsSuccessStatusCode,
                responseBody
            );
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }
}
