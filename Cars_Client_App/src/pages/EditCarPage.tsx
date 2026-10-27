import { useNavigate, useParams } from "react-router";
import type { Car, NewCar } from "../models/Car";
import { getCarById, updateCar } from "../services/carService";
import { useEffect, useState } from "react";
import CarForm from "../components/CarForm";

function EditCarPage() {

  const navigate = useNavigate();

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [car, setCar] = useState<Car | null>(null)

  //Get id param from route
  const { id } = useParams();

  const id_string = id.toString();



  //Handle car update
  async function handleUpdateCar(newCarData: NewCar){
    try
    {
      //call service method
      await updateCar(id_string, newCarData);
    
      //navigate to car list
      navigate(`/cars/${id}`);
    }
    catch(error)
    {
      setError(`An error occured: ${error.message}`)
    }
  }



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
        console.log(loadedCar)
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
  


  if (error) 
  {
    return <p className="error">{error}</p>;
  }

  if (loading) 
  {
    return <p>Loading data...</p>;
  }

  return (
    <>
      <div>Cars edit</div>
      <CarForm
        onSubmit={handleUpdateCar}
        initialData={car}
        submitText="Edit"
      />
    </>
  )
}

export default EditCarPage