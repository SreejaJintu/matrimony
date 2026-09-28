namespace SoeasyWebsite.Server.Interfaces;

public interface ISmsBitsService
{
    Task<(bool Success, string Response)> SendOtpAsync(
        string phoneNumber,
        string otp);
}
