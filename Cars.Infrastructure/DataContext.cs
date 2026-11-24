using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure
{
    public class DataContext: IdentityDbContext<AppUser, IdentityRole, string>
    {
        public DataContext(DbContextOptions<DataContext> options) 
            :base(options)
        { 
            
        }

        //Declare first dbSet
        public DbSet<Car> Cars => Set<Car>();
        public DbSet<Feature> Features => Set<Feature>();
        public DbSet<CarPhoto> CarPhotos => Set<CarPhoto>();



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Car>()
                .HasMany(car => car.Features)
                .WithMany(feature => feature.Cars)
                .UsingEntity(join => join.ToTable("CarFeatures"));
        }
    }




}
