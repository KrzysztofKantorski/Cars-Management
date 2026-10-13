using Cars.Domain;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) 
            :base(options)
        { 
            
        }

        //Declare first dbSet
        public DbSet<Car> Cars => Set<Car>();
    }
}
