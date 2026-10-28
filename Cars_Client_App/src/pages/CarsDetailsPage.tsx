import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import Loading from "../components/Loading";
import ApiError from "../components/ApiError";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

function CarsDetailsPage() {

  //Get id param from route
  const { id } = useParams();

  if(!id)
  {
    return <ApiError message={"No id was provided"}/>
  }

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
    loadCar(id)

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
    <div className="flex items-center justify-center w-full min-h-[80vh]">
      <Table className="w-[50%] ml-[25%] bg-destructive p-[2rem]">
        <TableCaption>Car {car.id} info</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead  className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell className="text-right">{car.brand}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell className="text-right">{car.model}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Doors number</TableCell>
            <TableCell className="text-right">{car.doorsNumber}</TableCell>
          </TableRow>


          <TableRow>
            <TableCell>Luggage capacity</TableCell>
            <TableCell className="text-right">{car.luggageCapacity}</TableCell>
          </TableRow>


          <TableRow>
            <TableCell>Engine capacity</TableCell>
            <TableCell className="text-right">{car.engineCapacity}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Fuel type</TableCell>
            <TableCell className="text-right">{car.fuelType}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Production date</TableCell>
            <TableCell className="text-right">{car.productionDate}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Avg fuel consumption</TableCell>
            <TableCell className="text-right">{car.averageFuelConsumption}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Body type</TableCell>
            <TableCell className="text-right ">{car.bodyType}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    </>
  )
}


export default CarsDetailsPage