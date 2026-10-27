import { Link } from 'react-router';
import type { Car } from '../models/Car';

interface CardProps {
  car: Car;
}

function Card(
    { car }: CardProps
)


{
  return (
    <>
        <div className="card">
            <h2>{car.brand}</h2>
            <p>{car.model}</p>
            <Link to={`/cars/${car.id}`}>Details</Link>
            <button>Delete</button>
        </div>
    </>
  ) 
}

export default Card