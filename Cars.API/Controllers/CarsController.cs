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
            var result = await _sender.Send(new Create.Command { Car = car });

            return CreatedAtAction(
                nameof(GetCar),
                new { Id = result.Id },
                result
            );


        }




        //Delete car
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> RemoveCar(
            [FromRoute] Guid id
            )
        {
            bool result = await _sender.Send(new Delete.Command { Id = id });
            if(!result)
            {
                return NotFound();
            }

            return NoContent();
        }



        //Update car
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> UpdateCar(Guid id, [FromBody] Car updatedCar)
        {
            var result = await _sender.Send(new Edit.Command
            {
                Id = id,
                Car = updatedCar
            });

            if(!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
