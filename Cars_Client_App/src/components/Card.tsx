import { Link } from 'react-router';
import type { Car } from '../models/Car';

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
        <div className="card">
            <h2>{car.brand}</h2>
            <p>{car.model}</p>

            <Link to={`/cars/${car.id}`}>Details</Link>
            
            {onRemove &&
                <button onClick={() => onRemove(car.id)}>Delete</button>
            }

           <Link to={`/cars/${car.id}/edit`}>Edit</Link>
        </div>
    </>
  ) 
}

export default Card