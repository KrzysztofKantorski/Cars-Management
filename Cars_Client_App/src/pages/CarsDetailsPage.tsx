import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import Loading from "../components/Loading";
import ApiError from "../components/ApiError";

function CarsDetailsPage() {

  //Get id param from route
  const { id } = useParams();

  const id_string = id.toString();

  //Car state
  const [car, setCar] = useState<Car | null>(null)

  //Error state
  const [error, setError] = useState<string | null>(null);

  //loading state
  const [loading, setLoading] = useState<boolean>(true);


  //Get car by id
  useEffect(()=>{
    const controller = new AbortController();

    async function loadCar(id: string){
      try
      {
        setLoading(true);
        setError(null);

        const loadedCar = await getCarById(id, controller.signal);

        //Update state
        setCar(loadedCar);
      }
      catch(error)
      {
        //Request has been abroted
        if(error instanceof DOMException && error.name === "AbortError")
        {
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
      finally{
        //Check if request was aborted
        if (!controller.signal.aborted) 
        {
          setLoading(false);
        }
      }
    }

    //Call load cars function
    loadCar(id_string)

    //Cleanup
    return () => {
      controller.abort();
    };

    
  }, [])

  if (loading) 
  {
    return <Loading/>;
  }

  if (error) 
  {
    return <ApiError message={error}/>
  }

  if (car == null) 
  {
    return <p>No cars found.</p>;
  }


  return(
    <>
      <h2>Brand: {car.brand}</h2>
      <p>Model: {car.model}</p>
      <p>Doors number: {car.doorsNumber}</p>
      <p>Luggage capacity: {car.luggageCapacity}</p>
      <p>Engine capacity: {car.engineCapacity}</p>
      <p>Fuel type: {car.fuelType}</p>
      <p>Production date: {car.productionDate}</p>
      <p>Avg fuel consumption: {car.averageFuelConsumption} / 100 km</p>
      <p>Body type: {car.bodyType}</p>
    </>
  )
}


export default CarsDetailsPage