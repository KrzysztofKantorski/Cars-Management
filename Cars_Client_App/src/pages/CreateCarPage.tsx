import { useNavigate } from "react-router";
import { createCar } from "../services/carService"
import CarForm from "../components/CarForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queries/queryKeys";
import type { CarFormValues } from "../models/CarFormValues";

function CreateCarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: (createdCar) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars,
      });

      navigate(`/cars/${createdCar.id}`);
    },
  });


  function handleCreateCar(values: CarFormValues) {
    createMutation.mutate(values);
  }
  

  return (
    <>
    <div className="min-h-[100vh] flex items-center justify-center w-screen flex-col">
     <h2 className="text-4xl mt-[5rem]">Add car</h2>
      <CarForm
        onSubmit={handleCreateCar}
        isSubmitting={createMutation.isPending}
        submitText="Add"
      />
    </div>
     
    </>
  )
}

export default CreateCarPage