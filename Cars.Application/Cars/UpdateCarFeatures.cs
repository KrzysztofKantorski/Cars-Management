using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars
{
    public class UpdateCarFeatures
    {

        public class Command : IRequest<bool>
        {
            public Guid CarId { get; set; }
            public List<Guid> FeatureIds { get; set; } = [];
        }


        public class Handler: IRequestHandler<Command, bool>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                //Find car (with features)
                var car = await _context.Cars.Include(c => c.Features)
                    .FirstOrDefaultAsync(c => c.Id == request.CarId, cancellationToken);

                if (car == null) 
                {
                    return false;
                }

                //Find features details
                var features = await _context.Features.Where(f => request.FeatureIds.Contains(f.Id))
                    .ToListAsync(cancellationToken);

                //Clear car features
                car.Features.Clear();

                //Save new features
                foreach (var feature in features) 
                { 
                    car.Features.Add(feature);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return true;
            }
        }
    }
}
