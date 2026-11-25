import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCarById, updateCar } from "../services/carService";
import { queryKeys } from "../queries/queryKeys";
import type { CarFormValues } from "../models/CarFormValues";
import ApiError from "../components/ApiError";
import Loading from "../components/Loading";
import CarForm from "../components/CarForm";
import { Button } from "../components/ui/button";

  function EditCarPage() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const {
    data: car,
    isPending: isCarPending,
    isError: isCarError,
    error: carError,
  } = useQuery({
    queryKey: queryKeys.car(id ?? ""),
    queryFn: ({ signal }) => getCarById(id!, signal),
    enabled: Boolean(id),
  });


  const updateMutation = useMutation({
    mutationFn: (values: CarFormValues) => updateCar(id!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars });
      queryClient.invalidateQueries({ queryKey: queryKeys.car(id!) });
      navigate(`/cars/${id}`);
    },
  });

  function handleUpdateCar(values: CarFormValues) {
    updateMutation.mutate(values);
  }


  if (!id) {
    return (
      <section className="flex flex-col items-center gap-4 mt-[4rem]">
        <ApiError message="No car ID was provided." />
        <Link to="/cars" className="underline">
          Back to cars list
        </Link>
      </section>
    );
  }

  if (isCarError) {
    return (
      <section className="flex flex-col items-center gap-4 mt-[4rem]">
        <ApiError message={carError.message} />
        <Link to="/cars" className="underline">
          Back to cars list
        </Link>
      </section>
    );
  }


  if (isCarPending) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-center gap-[2rem] mt-4 flex-col">
        <h2 className="text-center text-[3rem]">Cars edit</h2>
        <Button variant="outline">
          <Link to={`/cars/${id}/photos`}>Manage photos</Link>
        </Button>
      </div>
        {updateMutation.isError && (
          <div className="max-w-3xl mx-auto mt-4">
            <ApiError message={updateMutation.error.message} />
          </div>
        )}

        <CarForm
          onSubmit={handleUpdateCar}
          initialData={car}
          submitText="Save changes"
          isSubmitting={updateMutation.isPending}
          cancelTo={`/cars/${id}`}
        />
      </>
    )
  }

  export default EditCarPage