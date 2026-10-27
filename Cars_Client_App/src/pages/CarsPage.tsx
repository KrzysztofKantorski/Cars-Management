import { useEffect, useState } from "react"
import type { Car } from "../models/Car"
import { deleteCar, getCars } from "../services/carService";
import Card from "../components/Card";
import Loading from "../components/Loading";
import ApiError from "../components/ApiError";

function CarsPage() {

    //Set cars state
    const [cars, setCars] = useState<Car[]>([])

    //Error state
    const [error, setError] = useState<string | null>(null);

    //loading state
    const [loading, setLoading] = useState<boolean>(true);


    //Delete car
    async function removeCar(id: string){
        try
        {
            //Confirm window
            const confirm = window.confirm(
                `Do you want to delete this car?`
            );

            //User did not confirm window
            if(!confirm)
            {
                return;
            }

            //Call service method
            await deleteCar(id);

            //Update car list
            setCars((prevCars)=> prevCars.filter(car => car.id != id));
        }

        catch(err)
        {
            if (err instanceof Error) 
            {
                setError(`An error occurred: ${err.message}`);
            } 

            else 
            {
                setError("Unexpected error occurred while deleting.");
            }
        }
       
    }




    useEffect(()=>{
        const controller = new AbortController();

        //Get data
        async function loadCars(){
            try{
                setLoading(true);
                setError(null);

                //get cars from service method
                const loadedCars = await getCars(controller.signal);

                //Update state
                setCars(loadedCars)
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

            finally
            {
                //Check if request was aborted
                if (!controller.signal.aborted) 
                {
                    setLoading(false);
                }
            }
        }

        //Call load cars function
        loadCars()

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
        return <ApiError message={error}/>;
    }

    if (cars.length === 0) 
    {
        return <p>No cars found.</p>;
    }



    return (
        <>
            <div className="card-wrapper">
                {cars.map((car)=> (
                    <Card
                        key={car.id}
                        car={car}
                        onRemove={removeCar}
                    />
                ))}
            </div>
        </>
    )
}

export default CarsPage