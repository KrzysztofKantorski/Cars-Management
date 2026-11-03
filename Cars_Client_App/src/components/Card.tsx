import {useNavigate } from 'react-router';
import type { Car } from '../models/Car';
import { Button } from './ui/button';
import {useCarUiStore} from '../store/useCarUiStore';
import {
  Card as UiCard,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

interface CardProps {
  car: Car;
  onRemove?: (id: string) => Promise<void>;
}

function Card({ car, onRemove }: CardProps){ 
  const navigate = useNavigate();

  //Check if car is in favorites
  const isFavorite = useCarUiStore(
    (state)=> state.favoriteCarIds.includes(car.id)
  );


  const toggleFavorite = useCarUiStore(
    (state) => state.toggleFavorite
  );

  function goToPage(route: string) {
    console.log("siup");
    navigate(route);
  }
  return (
    <>
   <UiCard className="max-w-[250px]">
      <CardHeader>
        <CardTitle>{car.brand}</CardTitle>
        <CardDescription>{car.model}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-start align-center gap-4 border-t pt-4 bg-sky-500/50 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => goToPage(`/cars/${car.id}`)}>
          Details
        </Button>

        <Button variant="outline" size="sm"  onClick={() => goToPage(`/cars/${car.id}/edit`)}>
          Edit
        </Button>
        
        {onRemove && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onRemove(car.id)}
          >
            Delete
          </Button>
        )}


        <Button variant="outline" size="sm"  onClick={() => toggleFavorite(car.id)}>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
      </CardFooter>
    </UiCard>
    </>
  ) 
}

export default Card