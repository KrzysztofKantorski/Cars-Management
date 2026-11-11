using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace Cars.Infrastructure
{
    public static class IdentitySeed
    {
        public static async Task SeedAsync(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager
            )
        {
            //Define roles
            string[] roles = ["User", "Admin"];

            //Add roles to identity service
            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }


            //Create Admin account
            const string adminEmail = "admin@cars.local";
            var admin = await userManager.FindByEmailAsync(adminEmail);

            if(admin is null)
            {
                admin = new AppUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                
                var result = await userManager.CreateAsync(
                    admin, "Admin123");
                


                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(
                        string.Join("; ", result.Errors.Select(e => e.Description)));
                }
            }


            if (!await userManager.IsInRoleAsync(admin, "Admin"))
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
