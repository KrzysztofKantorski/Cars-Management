import type { Car,  NewCar } from "../models/Car";
import {appClient} from "../api/appClient";
import axios from "axios";
import type { Feature } from "../models/Feature";
import type { CarFormValues } from "../models/CarFormValues";
import type { CarPhoto } from "../models/CarPhoto";


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



//Get car features
export async function getCarFeatures(signal?: AbortSignal): Promise<Feature[]>{
    try
    {
        const response = await appClient.get<Feature[]>(`/features`, {signal});
        return response.data;   
    }

    catch(error)
    {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, `Could not fetch features`)
    }
}







//Create car
export async function createCar(
    values: CarFormValues
): Promise<Car>
{

    try
    {
        const { featureIds, ...carData } = values;
        const response = await appClient.post<Car>(`/cars`, carData);
        const createdCar = response.data;

        //Assign car features
        await updateCarFeatures(createdCar.id, featureIds);

        //Get car with assigned features
        return await getCarById(createdCar.id);
    }   

    catch(error)
    {
        throw createServiceError(error, "Could not create car")
    }
    
}



export async function updateCar(id: string, values: CarFormValues): Promise<void> {
  try {
    const { featureIds, ...carData } = values;
    //Update car base data
    await appClient.put<Car>(`/cars/${id}`, carData);

    //Update relation Car <-> Feature.
    await updateCarFeatures(id, featureIds);


  } catch (error) {
    throw createServiceError(error, "Could not update car");
  }
}


//Update car features
export async function updateCarFeatures(
    carId: string,
    featureIds: string[],
): Promise<void> {
    try {
        await appClient.put(`/cars/${carId}/features`, {
        featureIds,
        });
    } 
    catch (error) {
        throw createServiceError(error, "Could not update features.");
    }
}


//Add photo
export async function uploadCarPhoto(
    carId: string,
    file: File,
): Promise<CarPhoto> {
    try {
        const formData = new FormData();

        //Name must be ,,file'' - for backend 
        formData.append("file", file);

        const response = await appClient.post<CarPhoto>(
            `/cars/${carId}/photos`,
            formData,
        );

        return response.data;
    } 
    catch (error) {
        throw createServiceError(error, "Could not upload photo.");
    }
}



//Delete car photo
export async function deleteCarPhoto(
    carId: string,
    photoId: string,
): Promise<void> {
    try {
        await appClient.delete(`/cars/${carId}/photos/${photoId}`);
    } 
    catch (error) {
        throw createServiceError(error, "Could not delete photo.");
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