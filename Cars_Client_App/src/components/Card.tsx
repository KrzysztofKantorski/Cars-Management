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
import { useAuthStore } from '../store/useAuthStore';

interface CardProps {
  car: Car;
  onRemove?: (id: string) => Promise<void>;
}

function Card({ car, onRemove }: CardProps){ 
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  //Check if car is in favorites
  const favoriteCarIdsByUser = useCarUiStore((state) =>
    state.favoriteCarIdsByUser,
  );

  const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? []: [];

  const isFavorite =favoriteCarIds.includes(car.id);

  const toggleFavorite = useCarUiStore(
    (state) => state.toggleFavorite
  );

  function goToPage(route: string) {
    console.log("siup");
    navigate(route);
  }
  return (
    <>
   <UiCard className="max-w-[250px] bg-card">
      <CardHeader>
        <CardTitle>{car.brand}</CardTitle>
        <CardDescription>{car.model}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-start align-center gap-4 border-t pt-4 bg-card flex-wrap">
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


        <Button variant="outline" size="sm"  onClick={() => {if (user) { toggleFavorite(user.id, car.id); }}}>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
      </CardFooter>
    </UiCard>
    </>
  ) 
}

export default Card