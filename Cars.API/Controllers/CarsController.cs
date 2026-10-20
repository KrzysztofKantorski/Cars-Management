using Cars.Application.Cars;
using Cars.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cars.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : BaseApiController
    {
        private readonly ISender _sender;
        public CarsController(ISender sender) 
        {
            _sender = sender;
        }



        //Get all cars
        [HttpGet]
        public async Task<ActionResult<List<Car>>> GetCars()
        {

            return await _sender.Send(new GetCarsList.Query());
        }



        //Get car by id
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Car>> GetCar(Guid id)
        {
            var car =  await _sender.Send(new Details.Query { Id = id});

            if(car is null)
            {
                return NotFound();
            }

            return car;
        }



        //Add car 
        [HttpPost]
        public async Task<ActionResult> AddCar(
            [FromBody] Car car
            )
        {
            if(car.Id == Guid.Empty)
            {
                car.Id = Guid.NewGuid();
            }

            await _context.Cars.AddAsync(car);
            await _context.SaveChangesAsync();

            return Created();
        }




        //Delete car
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> RemoveCar(
            [FromRoute] Guid id
            )
        {
            var car = await _context.Cars.FirstOrDefaultAsync(x => x.Id == id);
            if(car is null) return NotFound();

            _context.Cars.Remove(car);

            await _context.SaveChangesAsync();
            return NoContent();
        }



        //Update car
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> UpdateCar(Guid id, [FromBody] Car updatedCar)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(x => x.Id == id);
            if (car is null) return NotFound();


            car.Brand = updatedCar.Brand;
            car.Model = updatedCar.Model;
            car.DoorsNumber = updatedCar.DoorsNumber;
            car.LuggageCapacity = updatedCar.LuggageCapacity;
            car.EngineCapacity = updatedCar.EngineCapacity;
            car.FuelType = updatedCar.FuelType;
            car.ProductionDate = updatedCar.ProductionDate;
            car.AverageFuelConsumption = updatedCar.AverageFuelConsumption;
            car.BodyType = updatedCar.BodyType;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
