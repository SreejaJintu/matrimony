using SoeasyWebsite.Server.Data;
using SoeasyWebsite.Server.Models;
using SoeasyWebsite.Server.RepositoryInterfaces;
using SoeasyWebsite.Server.Repositories;
using SoeasyWebsite.Server.Services;

var builder = WebApplication.CreateBuilder(args);


//---------------------------------------------------------
// Configuration
//---------------------------------------------------------

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));


//---------------------------------------------------------
// Services
//---------------------------------------------------------

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IDbConnectionFactory, DbConnectionFactory>();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IMasterRepository, MasterRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();

builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.IAuthService, AuthService>();
builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.IAccountService, AccountService>();
builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.IMasterService, MasterService>();
builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.IProfileService, ProfileService>();
builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.IMatchService, MatchService>();

builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<SoeasyWebsite.Server.Interfaces.ISubscriptionService, SubscriptionService>();

//---------------------------------------------------------
// CORS
//---------------------------------------------------------

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



var app = builder.Build();


//---------------------------------------------------------
// Middleware
//---------------------------------------------------------

app.UseDefaultFiles();

app.UseStaticFiles();

// Ensure local uploads folder exists
var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
var wwwUploads = Path.Combine(webRootPath, "uploads");
Directory.CreateDirectory(wwwUploads);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
