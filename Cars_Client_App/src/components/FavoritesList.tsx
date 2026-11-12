import { useEffect, useState } from "react";
import type { Car } from "../models/Car";
import { getCars } from "../services/carService";
import axios from "axios";
import Loading from "./Loading";
import ApiError from "./ApiError";
import { useCarUiStore } from "../store/useCarUiStore";
import { Button } from "./ui/button";
import { useAuthStore } from "../store/useAuthStore";

const EMPTY_FAVORITES: string[] = [];
function FavoritesList (){
  
    const user =useAuthStore((state) => state.user,);
    //Set cars state
    const [cars, setCars] = useState<Car[]>([])
    //Error state
    const [error, setError] = useState<string | null>(null);

    //loading state
    const [loading, setLoading] = useState<boolean>(true);

    const favoriteCount =useCarUiStore(
      (state) => 
        user ? (state.favoriteCarIdsByUser[user.id] ?? []).length: 0,
    );

    //Check if car is in favorites
    const favoriteCarIdsByUser = useCarUiStore((state) =>
      state.favoriteCarIdsByUser,
    );

    const favoriteCarIds = user ? (favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES) : EMPTY_FAVORITES;

    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        const controller = new AbortController();

        //Get data
        async function loadCars(){
            try{
                setLoading(true);
                setError(null);

                //get cars from service method
                const loadedCars = await getCars(controller.signal);

                //Update state
                setCars(loadedCars)
            }
            catch(error)
            {
                //Request has been abroted
                if(axios.isCancel(error)){
                    return;
                }

                if (error instanceof Error) 
                {
                    setError(error.message);
                } 

                else 
                {
                    setError("Unexpected error occured.");
                }
            }

            finally
            {
                //Check if request was aborted
                if (!controller.signal.aborted) 
                {
                    setLoading(false);
                }
            }
        }

        //Call load cars function
        loadCars()

        //Cleanup
        return () => {
            controller.abort();
        };

    }, [])


    //Get only favorite cars
   const favoriteCars = cars.filter((car)=>{
        const matchesFavorite = favoriteCarIds.includes(car.id);

        return matchesFavorite;

    })


    if (loading) 
    {
        return <Loading/>;
    }

    if (error) 
    {
        return <ApiError message={error}/>;
    }


    return(
       <div className="relative">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="shrink-0"
      >
        Favorites: {favoriteCount}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-2">
          {favoriteCount== 0 ? (
            <p className="text-sm text-muted-foreground p-2 text-center">
              No favorites yet
            </p>
          ) : (
            favoriteCars.map((car) => (
              <div 
                key={car.id} 
                className="bg-secondary text-secondary-foreground p-2 rounded-md flex items-center justify-between text-sm"
              >
                <span className="font-medium">{car.brand} {car.model}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    )
}

export default FavoritesList;