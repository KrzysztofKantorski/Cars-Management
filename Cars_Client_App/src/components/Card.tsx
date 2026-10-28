import {useNavigate } from 'react-router';
import type { Car } from '../models/Car';
import { Button } from './ui/button';
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

  function goToPage(route: string) {
    console.log("siup");
    navigate(route);
  }
  return (
    <>
   <UiCard className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{car.brand}</CardTitle>
        <CardDescription>{car.model}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-start gap-4 border-t pt-4 bg-sky-500/50">
        <Button variant="outline" size="sm" onClick={() => goToPage(`/cars/${car.id}`)}>
          Details
        </Button>

        <Button variant="secondary" size="sm"  onClick={() => goToPage(`/cars/${car.id}/edit`)}>
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
      </CardFooter>
    </UiCard>
    </>
  ) 
}

export default Card