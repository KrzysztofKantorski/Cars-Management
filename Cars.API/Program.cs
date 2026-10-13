using Cars.Infrastructure;
using Microsoft.EntityFrameworkCore;;

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

app.Run();
