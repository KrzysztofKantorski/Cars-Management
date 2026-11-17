using Cars.Application.Cars;
using Cars.Application.Cars.DTOs;
using Cars.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Cars.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
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
        public async Task<ActionResult<List<CarDto>>> GetCars()
        {

            return await _sender.Send(new GetCarsList.Query());
        }



        //Get car by id
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CarDto>> GetCar(Guid id)
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
        [Authorize(Roles = "Admin")]
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



        //Update car features
        [HttpPut("{id: guid}/features")]
        public async Task<IActionResult> UpdateFeatures(Guid id, UpdateCarFeaturesDto dto)
        {
            var result = await _sender.Send(new UpdateCarFeatures.Command
            {
                CarId = id,
                FeatureIds = dto.FeatureIds
            });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
