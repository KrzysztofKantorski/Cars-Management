import { useNavigate } from "react-router";
import type { NewCar } from "../models/Car"
import { createCar } from "../services/carService"
import { useState } from "react";
import CarForm from "../components/CarForm";
import ApiError from "../components/ApiError";

function CreateCarPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null)


  //Handle form action
  async function handleCreateCar(newCarData: NewCar){
    try{
      //call service method
      await createCar(newCarData);

      //navigate to car list
      navigate("/cars");
    }
    catch(error){
      setError(`An error occured: ${error.message}`)
    }
  }

  if (error) 
  {
    return <ApiError message={error}/>;
  }


  return (
    <>
      <div>Add new car</div>
      <CarForm
        onSubmit={handleCreateCar}
        submitText="Add"
      />
    </>
  )
}

export default CreateCarPage