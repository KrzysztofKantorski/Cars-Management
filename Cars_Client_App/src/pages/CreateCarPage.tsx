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
      <h2 className="text-center">Add car</h2>
      <CarForm
        onSubmit={handleCreateCar}
        isSubmitting={createMutation.isPending}
        submitText="Add"
      />
    </>
  )
}

export default CreateCarPage