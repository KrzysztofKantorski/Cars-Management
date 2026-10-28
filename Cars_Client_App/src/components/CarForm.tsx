import { useState } from "react";
import type { Car, NewCar } from "../models/Car";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


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


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        <div className="flex items-start justify-center w-full mt-[4rem]">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-3xl space-y-6 bg-sky-500/50 p-[2rem] rounded-md">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <FieldSet className="w-full" >
                    <FieldGroup className="space-y-2">
                        <Field>
                            <FieldLabel htmlFor="name">Car brand</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="brand" type="text" value={formData.brand} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Car model</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="model" type="text" value={formData.model} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Doors number</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="doorsNumber" type="number" value={formData.doorsNumber} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Luggage capacity</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="luggageCapacity" type="number" value={formData.luggageCapacity} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Engine capacity</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="engineCapacity" type="number" value={formData.engineCapacity} onChange={handleChange} required/>
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <FieldSet className="w-full">
                    <FieldGroup className="space-y-2">

                        <Field>
                            <FieldLabel htmlFor="name">Fuel type</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="fuelType" type="number" value={formData.fuelType} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Production date</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="productionDate" type="date" value={formData.productionDate} onChange={handleChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Avg fuel consumption</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="averageFuelConsumption" type="number" value={formData.averageFuelConsumption} onChange={handleChange} required/>
                        </Field>


                        <Field>
                            <FieldLabel htmlFor="name">Body type</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="bodyType" type="number" value={formData.bodyType} onChange={handleChange} required/>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
                <Button type="submit" variant="outline" className="w-[30%] ml-[35%] text-center mt-[2rem]">{submitText}</Button>
            </form>
        </div>
        </>
    )
}


export default CarForm;