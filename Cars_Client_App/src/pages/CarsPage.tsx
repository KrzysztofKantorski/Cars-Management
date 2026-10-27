import { useEffect, useState } from "react"
import type { Car } from "../models/Car"
import { getCars } from "../services/CarService";

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
        return <p>Ładowanie danych...</p>;
    }

    if (error) 
    {
        return <p className="error">{error}</p>;
    }

    if (cars.length === 0) 
    {
        return <p>Nie znaleziono samochodów.</p>;
    }



    return (
        <>
            <div>

                {cars.map((car)=> (
                    <div>
                        <h2>
                            {car.brand}
                        </h2>

                        <p>
                            {car.model}
                        </p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default CarsPage