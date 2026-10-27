import type { Car,  NewCar } from "../models/Car";

const apiUrl = 'http://localhost:3000/cars';



//check if response is OK
async function ensureSuccess(response: Response)
{
    if(!response.ok)
    {
        throw new Error(`Request failed. Status: ${response.status}`)
    }
}



//Get cars
export async function getCars(
    signal? : AbortSignal): Promise<Car[]>
{
    const response = await fetch(apiUrl, {signal});

    await ensureSuccess(response);

    return await response.json();
}



//Get car by id
export async function getCarById(
    id: string,
    signal?: AbortSignal): Promise<Car>
{
    const response = await fetch(`${apiUrl}/${id}`, {signal});

    await ensureSuccess(response);

    return await response.json();
}




//Create car
export async function createCar(
    car: NewCar
): Promise<Car>
{
    const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(car)
    });

    await ensureSuccess(response);

    return await response.json();
}



//Update car
export async function updateCar(
    id: string,
    car: NewCar
): Promise<void>
{
    const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(car)
    });

    await ensureSuccess(response);

    return await response.json();
}




//Delete car
export async function deleteCar(
    id: string
): Promise<void>
{
    const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });

    await ensureSuccess(response);
}