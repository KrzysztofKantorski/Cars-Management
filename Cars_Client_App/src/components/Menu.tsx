import { Link, useNavigate } from 'react-router';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, } from './ui/navigation-menu';
import FavoritesList from "./FavoritesList"
import { useAuthStore } from '../store/useAuthStore';
import { Button } from './ui/button';


function Menu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
    <div className="w-full mb-[2rem] p-[1rem] bg-card border-b text-card-foreground flex items-center justify-between">


        <NavigationMenu>
        <NavigationMenuList>

          <NavigationMenuItem className='mr-[1rem]'>
            <Link to="/">
                Main page
              </Link>
          </NavigationMenuItem>

          {user && (
            <>
              <NavigationMenuItem className='mr-[1rem]'>
              <Link to="/cars">
                  Cars
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className='mr-[1rem]'>
                <Link to="/cars/new">
                    Add car
                  </Link>
              </NavigationMenuItem>
            </>
          )}

        </NavigationMenuList>

         

        
      </NavigationMenu>
      {user ? (
        <div className='flex gap-[1rem]'> 
        <FavoritesList />
        <Button
        onClick={handleLogout}
        >
        Logout
        </Button>
        </div>
       
        
      ): (
        <div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-4">
             <NavigationMenuItem className='mr-[1rem]'>
                <Link to="/login">
                    Login
                  </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className='mr-[1rem]'>
                <Link to="/register">
                    Register
                  </Link>
          </NavigationMenuItem>
          </NavigationMenuList>
          
        </NavigationMenu>
        
        </div>
       
      )}
      
    </div>
  
    </>
  ) 
}

export default Menu