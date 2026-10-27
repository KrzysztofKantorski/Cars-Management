import { useState } from "react";
import type { Car, NewCar } from "../models/Car";


interface CarFormProps 
{
  onSubmit: (carData: NewCar) => Promise<void>;
  initialData?: Car;
  submitText: string;
}


const defaultCarValues: NewCar = {
  brand: "",
  model: "",
  doorsNumber: 4,
  luggageCapacity: 400,
  engineCapacity: 2000,
  fuelType: 1,
  productionDate: "",
  averageFuelConsumption: 6.5,
  bodyType: 1,
};

function CarForm({ onSubmit, initialData, submitText}: CarFormProps){

   
    //Fill inputs with initial data
    const [formData, setFormData] = useState<NewCar>(initialData ?? defaultCarValues);
    

    async function handleSubmit (e: React.FormEvent) 
    {
        e.preventDefault(); 
        await onSubmit(formData); 
    };


    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((currentFormData) => 
        ({
            ...currentFormData,
            //Get property name to update
            [name]: value, 
        })
        );

        console.log(value)

    }



    return(
        <>
        <form className="car-form" onSubmit={handleSubmit}>

            <label>
                Brand
                <input
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                />
            </label>


            <label>
                Model
                <input
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    required
                />
            </label>


            <label>
                Doors number
                <input
                    name="doorsNumber"
                    type="number"
                    value={formData.doorsNumber}
                    onChange={handleChange}
                    required
                />
            </label>


             <label>
                Luggage capacity
                <input
                    name="luggageCapacity"
                    type="number"
                    value={formData.luggageCapacity}
                    onChange={handleChange}
                    required
                />
            </label>


             <label>
                Engine capacity
                <input
                    name="engineCapacity"
                    type="number"
                    value={formData.engineCapacity}
                    onChange={handleChange}
                    required
                />
            </label>


             <label>
                Fuel type
                <input
                    name="fuelType"
                    type="number"
                    value={formData.fuelType}
                    onChange={handleChange}
                    required
                />
            </label>


             <label>
                Production date
                <input
                    name="productionDate"
                    type="date"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                />
            </label>


            <label>
                Avg fuel consumption
                <input
                    name="averageFuelConsumption"
                    type="number"
                    value={formData.averageFuelConsumption}
                    onChange={handleChange}
                    required
                />
            </label>


            <label>
                bodyType
                <input
                    name="bodyType"
                    type="number"
                    value={formData.bodyType}
                    onChange={handleChange}
                    required
                />
            </label>
            <button type="submit" className="btn-submit">{submitText}</button>
        </form>
        </>
    )
}


export default CarForm;