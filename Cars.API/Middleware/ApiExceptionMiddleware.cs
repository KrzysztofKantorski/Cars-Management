using System.Net;
using System.Text.RegularExpressions;
using Cars.Application.Cars;
using FluentValidation;

namespace Cars.API.Middleware
{
    public class ApiExceptionMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<ApiExceptionMiddleware> _logger;

        public ApiExceptionMiddleware(
            RequestDelegate next,
            ILogger<ApiExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }


        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }

            catch (ValidationException ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                //Group errors
                var errors = ex.Errors.GroupBy(e => e.PropertyName)
                    .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray());


                //Write json response
                await context.Response.WriteAsJsonAsync(
                    new
                    {
                        title = "Validation error",
                        status = 400,
                        errors
                    }
                );
            }


            catch(Exception ex)
            {
                _logger.LogError(ex, "An error occured");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                //Return json response
                await context.Response.WriteAsJsonAsync(new
                {
                    title = "Server error",
                    status = 500,
                    detail = "An unexpected error occurred."
                });
            }
        }
    }
}
