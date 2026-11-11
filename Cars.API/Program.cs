using Cars.API.Middleware;
using Cars.API.Services;
using Cars.API.Services.Email;
using Cars.Application.Cars;
using Cars.Application.Common.Behaviors;
using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);


//Register db
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlite(
    builder.Configuration.GetConnectionString("DefaultConnection"));
});


//Register cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:5174");
    });
});



//Register identity service
builder.Services.AddIdentityCore<AppUser>(options =>
{

    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;

    //Password config
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;

})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<DataContext>()
.AddDefaultTokenProviders();



//Register JWT
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Brak Jwt:Key.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddAuthorization();




//Register token service
builder.Services.AddScoped<ITokenService, TokenService>();

//Get email settings
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Smtp"));

//Register email service
builder.Services.AddScoped<IEmailService, EmailService>();




// Add services to the container.

builder.Services.AddControllers();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



//MediaR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(GetCarsList.Handler).Assembly);
});


builder.Services.AddValidatorsFromAssemblyContaining<Create.CommandValidator>();

 builder.Services.AddTransient(
     typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


//Middleware
app.UseMiddleware<ApiExceptionMiddleware>();

using var scope = app.Services.CreateScope();




var services = scope.ServiceProvider;




//UserManager
var userManager = services.GetRequiredService<
 UserManager<AppUser>>();

//Role manager
var roleManager = services.GetRequiredService <
 RoleManager<IdentityRole>>();


await IdentitySeed.SeedAsync(
    userManager,
    roleManager
);


//Create migration when app starts
try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();

    //Seed data
    await Seed.SeedData(context);
}
catch(Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}



app.Run();
