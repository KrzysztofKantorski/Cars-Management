import type { Car } from "../models/Car";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { CarFormValues } from "../models/CarFormValues";
import { useQuery } from "@tanstack/react-query";
import { getCarFeatures } from "../services/carService";
import { queryKeys } from "../queries/queryKeys";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link } from "react-router";

interface CarFormProps {
  onSubmit: (values: CarFormValues) => void;
  initialData?: Car;
  submitText: string;
  isSubmitting?: boolean;
  cancelTo?: string;
}


const defaultCarValues: CarFormValues = {
  brand: "",
  model: "",
  doorsNumber: 5,
  luggageCapacity: 400,
  engineCapacity: 1600,
  fuelType: 0,
  productionDate: "",
  averageFuelConsumption: 6.5,
  bodyType: 0,
  featureIds: [],
};


//Map Car entity to form values
function mapCarToFormValues(car?: Car): CarFormValues {
  if (!car) return defaultCarValues;

  return {
    brand: car.brand,
    model: car.model,
    doorsNumber: car.doorsNumber,
    luggageCapacity: car.luggageCapacity,
    engineCapacity: car.engineCapacity,
    fuelType: car.fuelType,
    //Parse date 
    productionDate: car.productionDate ? car.productionDate.split("T")[0] : "",
    averageFuelConsumption: car.averageFuelConsumption,
    bodyType: car.bodyType,
    featureIds: car.features ? car.features.map((f) => f.id) : [],
  };
}


function CarForm({ onSubmit, initialData, submitText, isSubmitting = false, cancelTo}: CarFormProps){
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CarFormValues>({
        defaultValues: mapCarToFormValues(initialData),
    });

    //Get possible car features 
    const {
    data: features = [],
    isPending: areFeaturesPending,
    isError: areFeaturesError,
    error: featuresError,
  } = useQuery({
    queryKey: queryKeys.features,
    queryFn: ({ signal }) => getCarFeatures(signal),
  });
    
    //Reset form
    useEffect(() => {
        if (!initialData) return;
        reset(mapCarToFormValues(initialData));
    }, [initialData, features, reset]);

    return(
        <>
        <div className="flex items-start justify-center w-full mt-[2rem]">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-3xl space-y-6 bg-card p-[2rem] rounded-md bg-card">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <FieldSet className="w-full" >
                    <FieldGroup className="space-y-2">
                        <Field>
                            <FieldLabel htmlFor="brand">Car brand</FieldLabel>
                            <Input
                                id="brand"
                                autoComplete="off"
                                placeholder="ex. Toyota"
                                {...register("brand", {
                                    required: "Brand is required",
                                    minLength: {
                                        value: 2,
                                        message: "Incorrect brand",
                                    },
                                })}
                            />
                            {errors.brand && (
                                <p className="text-sm text-destructive">{errors.brand.message}</p>
                            )}
                        </Field>



                        <Field>
                            <FieldLabel htmlFor="model">Car model</FieldLabel>
                            <Input
                                id="model"
                                autoComplete="off"
                                placeholder="np. Corolla"
                                {...register("model", {
                                    required: "Model is required",
                                })}
                            />
                            {errors.model && (
                                <p className="text-sm text-destructive">{errors.model.message}</p>
                            )}
                        </Field>



                        <Field>
                            <FieldLabel htmlFor="doorsNumber">Doors number</FieldLabel>
                            <Input
                                id="doorsNumber"
                                type="number"
                                {...register("doorsNumber", {
                                    valueAsNumber: true,
                                    required: "Provide doors number",
                                    min: { value: 2, message: "Min 2 doors" },
                                    max: { value: 5, message: "Max 5 doors" },
                                })}
                            />
                            {errors.doorsNumber && (
                                <p className="text-sm text-destructive">{errors.doorsNumber.message}</p>
                            )}
                        </Field>



                        <Field>
                            <FieldLabel htmlFor="luggageCapacity">Luggage capacity</FieldLabel>
                            <Input
                                id="luggageCapacity"
                                type="number"
                                {...register("luggageCapacity", {
                                    valueAsNumber: true,
                                    required: "Provide luggage capacity",
                                    min: { value: 0, message: "Value cannot be <0" },
                                })}
                            />
                            {errors.luggageCapacity && (
                                <p className="text-sm text-destructive">{errors.luggageCapacity.message}</p>
                            )}
                        </Field>



                        <Field>
                            <FieldLabel htmlFor="engineCapacity">Engine capacity</FieldLabel>
                            <Input
                                id="engineCapacity"
                                type="number"
                                {...register("engineCapacity", {
                                    valueAsNumber: true,
                                    required: "Provide engine capacity",
                                    min: { value: 1, message: "Value must be >0" },
                                })}
                            />
                            {errors.engineCapacity && (
                                <p className="text-sm text-destructive">{errors.engineCapacity.message}</p>
                            )}
                        </Field>
                    </FieldGroup>
                </FieldSet>




                
                <FieldSet className="w-full">
                    <FieldGroup className="space-y-2">

                        <Field>
                            <FieldLabel htmlFor="fuelType">Fuel type</FieldLabel>
                            <select
                                id="fuelType"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                {...register("fuelType", { valueAsNumber: true })}
                                >
                                <option value={0}>Petrol</option>
                                <option value={1}>Diesel</option>
                                <option value={2}>Hybrid</option>
                                <option value={3}>Electric</option>
                                <option value={4}>LPG</option>
                            </select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="productionDate">Production date</FieldLabel>

                            <Input
                                id="productionDate"
                                type="date"
                                {...register("productionDate", {
                                    required: "Provide production date",
                                })}
                            />

                            {errors.productionDate && (
                                <p className="text-sm text-destructive">{errors.productionDate.message}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="averageFuelConsumption">Avg fuel consumption</FieldLabel>
                            <Input
                                id="averageFuelConsumption"
                                type="number"
                                step="0.1"
                                {...register("averageFuelConsumption", {
                                    valueAsNumber: true,
                                    required: "Provide avg fuel consulmtion",
                                    min: { value: 0.1, message: "Value must be >0" },
                                })}
                            />

                            {errors.averageFuelConsumption && (
                                <p className="text-sm text-destructive">{errors.averageFuelConsumption.message}</p>
                            )}
                        </Field>


                        <Field>
                            <FieldLabel htmlFor="bodyType">Body type</FieldLabel>
                            <select
                                id="bodyType"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                {...register("bodyType", { valueAsNumber: true })}
                                >
                                <option value={0}>Hatchback</option>
                                <option value={1}>Sedan</option>
                                <option value={2}>Kombi</option>
                                <option value={3}>SUV</option>
                                <option value={4}>Roadster</option>
                            </select>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>


            {/* (FEATURES) */}
            <div className="space-y-2 pt-2 border-t border-border">
                <FieldLabel>Features</FieldLabel>
                {areFeaturesPending && (
                    <p className="text-sm text-muted-foreground">Loading features...</p>
                )}
                {areFeaturesError && (
                    <p className="text-sm text-destructive">{featuresError.message}</p>
                )}
                {!areFeaturesPending && !areFeaturesError && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {features.map((feature) => (
                        <label
                        key={feature.id}
                        className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded hover:bg-accent"
                        >
                        <input
                            type="checkbox"
                            value={feature.id}
                            className="h-4 w-4 rounded border-input"
                            {...register("featureIds")}
                        />
                        <span>{feature.name}</span>
                        </label>
                    ))}
                    </div>
                )}
            </div>


            <div className="flex items-center justify-center gap-4 mt-[2rem]">

                <Button type="submit" variant="outline" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitText}
                </Button>

                {cancelTo && (
                    <Button type="button" variant="ghost">
                    <Link to={cancelTo}>Cancel</Link>
                    </Button>
                )}
            </div>
            </form>
        </div>
        </>
    )
}


export default CarForm;


