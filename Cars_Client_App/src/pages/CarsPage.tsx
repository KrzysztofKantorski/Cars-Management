import { useEffect, useState } from "react"
import type { Car } from "../models/Car"
import { deleteCar, getCars } from "../services/carService";
import Card from "../components/Card";
import Loading from "../components/Loading";
import ApiError from "../components/ApiError";
import axios from "axios";
import {useCarUiStore} from "../store/useCarUiStore";



function CarsPage() {

    //Set cars state
    const [cars, setCars] = useState<Car[]>([])

    //Error state
    const [error, setError] = useState<string | null>(null);

    //loading state
    const [loading, setLoading] = useState<boolean>(true);



    //Global state for favorite cars
 
    const searchTerm = useCarUiStore((state)=> state.searchTerm);
    const setSearchTerm = useCarUiStore((state)=> state.setSearchTerm);
    const showFavoritesOnly = useCarUiStore((state)=> state.showFavoritesOnly);
    const setShowFavoritesOnly = useCarUiStore((state)=> state.setShowFavoritesOnly);
    const favoriteCarIds = useCarUiStore((state)=> state.favoriteCarIds);

    //Remove car from global state
    const removeFavorite = useCarUiStore(
        (state) => state.removeFavorite
    );

    //Normalize search query
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const visibleCars = cars.filter((car)=>{

        //Check if car matches search query and favorite filter
        const matchesSearch = 
            car.brand.toLowerCase().includes(normalizedSearch)
            || 
            car.model.toLowerCase().includes(normalizedSearch);
        
        const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);

        return matchesSearch && matchesFavorite;

    })


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

            //Remove from favorites
            removeFavorite(id);

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
                if(axios.isCancel(error)){
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
        <label>
            <input type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            Show favorites only
        </label>


            <div className="flex flex-wrap items-center justify-center gap-[2rem] w-[70%] ml-[15%] mt-[5rem] pb-[5rem]">
                {visibleCars.map((car)=> (
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