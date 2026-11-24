import { useState } from "react";
import { getCars } from "../services/carService";
import Loading from "./Loading";
import ApiError from "./ApiError";
import { useCarUiStore } from "../store/useCarUiStore";
import { Button } from "./ui/button";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queries/queryKeys";

const EMPTY_FAVORITES: string[] = [];
function FavoritesList (){
  
  const user =useAuthStore((state) => state.user,);
  const [isOpen, setIsOpen] = useState(false);

  //Get cars
  const {
  data: cars = [],
  isPending,
  isError,
  error,
  } = useQuery({
    queryKey: queryKeys.cars,
    queryFn: ({ signal }) => getCars(signal),
  });

  const favoriteCount =useCarUiStore(
    (state) => 
      user ? (state.favoriteCarIdsByUser[user.id] ?? []).length: 0,
  );

  //Check if car is in favorites
  const favoriteCarIdsByUser = useCarUiStore((state) =>
    state.favoriteCarIdsByUser,
  );

  const favoriteCarIds = user ? (favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES) : EMPTY_FAVORITES;


  
  //Get only favorite cars
  const favoriteCars = cars.filter((car)=>{
    const matchesFavorite = favoriteCarIds.includes(car.id);
    return matchesFavorite;
  })


  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ApiError message={error.message} />;
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