  import { useNavigate, useParams } from "react-router";
  import type { Car, NewCar } from "../models/Car";
  import { getCarById, updateCar } from "../services/carService";
  import { useEffect, useState } from "react";
  import CarForm from "../components/CarForm";
  import ApiError from "../components/ApiError";
  import Loading from "../components/Loading";

  function EditCarPage() {

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [car, setCar] = useState<Car | null>(null)

    //Get id param from route
    const { id } = useParams();

    if(!id)
    {
      return <ApiError message={"No id was provided"}/>
    }

    
    //Handle car update
    async function handleUpdateCar(newCarData: NewCar){

      if (!id) return;


      try
      {
        //call service method
        await updateCar(id, newCarData);
      
        //navigate to car list
        navigate(`/cars/${id}`);
      }
      catch(err)
      {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred.");
        }
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
        loadCar(id)
    
        //Cleanup
        return () => {
          controller.abort();
        };
    
        
      }, [])
    


    if (error) 
    {
      return <ApiError message={error}/>;
    }

    if (loading) 
    {
      return <Loading/>;
    }

    return (
      <>
        <div>Cars edit</div>
        <CarForm
          onSubmit={handleUpdateCar}
          initialData={car ?? undefined}
          submitText="Edit"
        />
      </>
    )
  }

  export default EditCarPage