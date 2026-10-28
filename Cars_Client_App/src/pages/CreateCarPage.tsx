import { useNavigate } from "react-router";
import type { NewCar } from "../models/Car"
import { createCar } from "../services/carService"
import { useState } from "react";
import CarForm from "../components/CarForm";
import ApiError from "../components/ApiError";

function CreateCarPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null)


  //Handle form action
  async function handleCreateCar(newCarData: NewCar){
    try{
      //call service method
      await createCar(newCarData);

      //navigate to car list
      navigate("/cars");
    }
    catch(error){
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
  }

  if (error) 
  {
    return <ApiError message={error}/>;
  }


  return (
    <>
      <h2 className="text-center">Add car</h2>
      <CarForm
        onSubmit={handleCreateCar}
        submitText="Add"
      />
    </>
  )
}

export default CreateCarPage