using Cars.Infrastructure;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Cars.Application.Cars;
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
        .WithOrigins("http://localhost:5173");
    });
});


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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();

var services = scope.ServiceProvider;


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
