using Cars.Application.Cars;
using Cars.Application.Cars.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeaturesController : BaseApiController
    {
        private readonly ISender _sender;

        public FeaturesController(ISender sender)
        {
            _sender = sender;
        }


        [HttpGet]
        public async Task<ActionResult<List<FeatureDto>>> GetFeatures()
        {
            return await _sender.Send(new GetFeaturesList.Query());
        }
    }
}
