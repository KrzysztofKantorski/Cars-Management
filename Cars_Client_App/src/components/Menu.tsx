import { NavLink } from 'react-router';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink,
   NavigationMenuList } from './ui/navigation-menu';

function Menu() {
  return (
    <>
    <div className="w-full bg-sky-500/50 mb-[2rem] p-[1rem]">

    
        <NavigationMenu>
        <NavigationMenuList>

         <NavigationMenuItem>
          <NavigationMenuLink >
            <NavLink to="/">Main page</NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink >
            <NavLink to="/cars">Cars</NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink >
            <NavLink to="/cars/new">Add car</NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
    </>
  ) 
}

export default Menu