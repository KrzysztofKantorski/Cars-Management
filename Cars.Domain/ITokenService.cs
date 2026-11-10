namespace Cars.Domain
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser user);
    }
}
