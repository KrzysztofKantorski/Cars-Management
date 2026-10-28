import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { Button } from './ui/button';
import {
  Card as UiCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

interface CardProps {
  car: Car;
  onRemove?: (id: string) => Promise<void>;
}

function Card(
    { car, onRemove }: CardProps
)


{ 
  return (
    <>
    <UiCard>
      <CardHeader>
        <CardTitle>{car.brand}</CardTitle>
        <CardDescription>
          {car.model}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="justify-end gap-2">

        <Button>
          <Link to={`/cars/${car.id}`}>Details</Link>
        </Button>

        <Button>
          <Link to={`/cars/${car.id}/edit`}>Edit</Link>
        </Button>
        
        {onRemove &&
          <Button onClick={() => onRemove(car.id)}>Delete</Button>
        }
      </CardFooter>
    </UiCard>
    </>
  ) 
}

export default Card