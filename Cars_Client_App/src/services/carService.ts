import type { Car,  NewCar } from "../models/Car";
import {appClient} from "../api/appClient";
import axios from "axios";


//Error handling
function createServiceError(error: unknown, message: string): Error
{

    //If request was cancelled
    if (axios.isCancel(error)) 
    {
        return error as Error;
    }


    if(axios.isAxiosError(error))
    {
        if(error.response)
        {
            return new Error(`${message} Status HTTP: ${error.response.status}`,
                {
                    cause: error
                }
            )
        }

        if(error.request)
        {
            return new Error(`${message} Brak odpowiedzi z serwera.`,
                {
                    cause: error
                }
            )
        }

        return new Error(
            `${message} ${error.message}`,
            {
                cause: error
            }
        )


    }


    return new Error(message, {cause: error})
}





//Get cars
export async function getCars(
    signal? : AbortSignal): Promise<Car[]>
{

    try
    {
        const response = await appClient.get<Car[]>('/cars', {signal});
        return response.data;
    }

    catch(error)
    {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, "Error while fetching cars.")
    }
    
}



//Get car by id
export async function getCarById(
    id: string,
    signal?: AbortSignal): Promise<Car>
{
    try
    {
        const response = await appClient.get<Car>(`/cars/${id}`, {signal});
        return response.data;   
    }

    catch(error)
    {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, `Error while fetching car with id: ${id}.`)
    }
}






//Create car
export async function createCar(
    car: NewCar
): Promise<Car>
{
    try
    {
        const response = await appClient.post<Car>(`/cars`, car);
        return response.data;
    }   

    catch(error)
    {
        throw createServiceError(error, "Error while creating car.")
    }
    
}



//Update car
export async function updateCar(
    id: string,
    car: NewCar
): Promise<void>
{
    try
    {
        await appClient.put<Car>(`/cars/${id}`, car);
    }   

    catch(error)
    {
        throw createServiceError(error, "Error while updating car.")
    }

    
}




//Delete car
export async function deleteCar(
    id: string
): Promise<void>
{
    try
    {
        await appClient.delete<Car>(`/cars/${id}`);
    }   

    catch(error)
    {
        throw createServiceError(error, "Error while deleting car.")
    }
}