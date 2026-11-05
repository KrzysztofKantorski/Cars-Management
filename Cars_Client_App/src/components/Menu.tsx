import { Link } from 'react-router';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, } from './ui/navigation-menu';
import FavoritesList from "./FavoritesList"


function Menu() {
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

        </NavigationMenuList>

         

        
      </NavigationMenu>
      <FavoritesList />
    </div>
  
    </>
  ) 
}

export default Menu