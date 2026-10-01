namespace SoeasyWebsite.Server.DTOs.Admin;

public class ExecutiveOperationResultDto
{
    public int ResultCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? ExecutiveId { get; set; }
}