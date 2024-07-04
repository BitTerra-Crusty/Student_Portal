using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
//using NETCore.MailKit.Core;
using student_portal.api.Context;
using student_portal.api.UtilityService;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin();
        builder.AllowAnyMethod();
        builder.AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(option =>
{
   option.UseSqlServer(builder.Configuration.GetConnectionString("sqlServerConnStr"));
});

//var connectionString = builder.Configuration.GetConnectionString("sqlServerConnStr");

//builder.Services.AddDbContext<AppDbContext>(option =>
//{
 //  option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
//});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("badbadbadsecret.....")),
        ValidateAudience = false,
        ValidateIssuer = false,
        ClockSkew =TimeSpan.Zero

    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
