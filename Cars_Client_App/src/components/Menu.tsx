import { Link } from 'react-router';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, } from './ui/navigation-menu';
import { useCarUiStore } from '../store/useCarUiStore';

function Menu() {

  //Get quantity of favorite cars
  const favoriteCount = useCarUiStore(
    (state) =>state.favoriteCarIds.length,
  )


  return (
    <>
    <div className="w-full mb-[2rem] p-[1rem] bg-card border-b text-card-foreground">


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


        <NavigationMenuItem className='mr-[1rem]'>
          <Link to="/cars/new">
              Add car
            </Link>
        </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
    </>
  ) 
}

export default Menu