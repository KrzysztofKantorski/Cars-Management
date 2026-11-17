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
        private readonly IWebHostEnvironment _environment;
        public CarsController(ISender sender, IWebHostEnvironment environment)
        {
            _sender = sender;
            _environment = environment;
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
        [HttpPut("{id:guid}/features")]
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



        //Upload car photo
        [HttpPost("{id:guid}/photos")]
        [RequestSizeLimit(5_000_000)]
        public async Task<ActionResult<CarPhotoDto>> UploadPhoto(
            Guid id, 
            IFormFile file, 
            CancellationToken cancellationToken)
        {


            //Check if file is empty / nothing was sent
            if(file is null || file.Length == 0)
            {
                return BadRequest("File was not sent");
            }

            //Define allowed file extensions
            var allowedExtensions = new[]
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
            };

            //Get file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            //Check if file extension matches allowed extensions
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Incorrect file extension. Allowed: JPG, JPEG, PNG i WebP.");
            }

            var fileName = $"{Guid.NewGuid()}{extension}";

            var webRootPath = _environment.WebRootPath ?? Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot");

            var uploadDirectory = Path.Combine(webRootPath, "uploads", "cars");

            Directory.CreateDirectory(uploadDirectory);

            var filePath = Path.Combine(uploadDirectory, fileName);

            //Save file to directory
            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            //Generate url address
            var url = $"{Request.Scheme}://{Request.Host}/uploads/cars/{fileName}";


            //Save metadata
            var result = await _sender.Send(new AddCarPhoto.Command
            {
                CarId = id,
                FileName = fileName,
                Url = url
            });

            if(result is null)
            {
                //Remove file
                System.IO.File.Delete(filePath);
                return NotFound();
            }

            return CreatedAtAction(nameof(GetCar), new { id }, result);
        }

    }
}
