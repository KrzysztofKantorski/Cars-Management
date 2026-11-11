using Cars.API.DTOs;
using Cars.API.Services.Email;
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace Cars.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, 
            IEmailService emailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _configuration = configuration;
        }



        private async Task<UserDto> CreateUserDtoAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            //return new user dto object
            return new UserDto(
                user.Id,
                user.UserName ?? string.Empty,
                user.Email ?? string.Empty,
                await _tokenService.CreateTokenAsync(user),
                roles.ToArray()
            );
        }



        //User registration
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.UserName.Trim(),
                Email = dto.Email.Trim(),
            };

            //Save user in identity manager
            var result = await _userManager.CreateAsync(user, dto.Password);


            if (!result.Succeeded) 
            {
                return BadRequest(result.Errors.Select(error => error.Description));
            }

            //Add role to user
            await _userManager.AddToRoleAsync(user, "User");

            //Create email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));


            //Build email confirmation url
            var clientBaseUrl = _configuration["Client:BaseUrl"] 
                ?? throw new InvalidOperationException("Missing Client:BaseUrl.");

            var resetUrl = 
                $"{clientBaseUrl}/confirm-email"
                +$"?userId={Uri.EscapeDataString(user.Id)}"
                + $"&token={Uri.EscapeDataString(encodedToken)}";


            //Send email
            await _emailService.SendAsync(
                user.Email!,
                "Reset hasła Cars",
                $"""
                    <h2>Cars</h2>
                    <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
                    <p><a href="{resetUrl}">Ustaw nowe hasło</a></p>
                """
            );

            return Ok(
                new
                {
                    message= "Jeżeli konto istnieje, wysłaliśmy wiadomość z instrukcją"
                }
            );

        }
    }
}
