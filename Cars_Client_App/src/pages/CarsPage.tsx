import { useEffect, useState } from "react"
import type { Car } from "../models/Car"
import { getCars } from "../services/carService";
import Card from "../components/Card";

function CarsPage() {

    //Set cars state
    const [cars, setCars] = useState<Car[]>([])

    //Error state
    const [error, setError] = useState<string | null>(null);

    //loading state
    const [loading, setLoading] = useState<boolean>(true);


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
        return <p>Loading data...</p>;
    }

    if (error) 
    {
        return <p className="error">{error}</p>;
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
                    />
                ))}
            </div>
        </>
    )
}

export default CarsPage