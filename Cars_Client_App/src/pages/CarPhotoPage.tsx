import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { queryKeys } from "../queries/queryKeys";
import { getCarById } from "../services/carService";
import ApiError from "../components/ApiError";
import Loading from "../components/Loading";
import { Button } from "../components/ui/button";
import CarPhotoUpload from "../components/CarPhotoUpload";

export default function CarPhotoPage(){
    const { id } = useParams();
    const queryClient = useQueryClient();

    const {
        data: car,
        isPending,
        isError,
        error,
    } = useQuery({
    queryKey: queryKeys.car(id ?? ""),
    queryFn: ({ signal }) => getCarById(id!, signal),
    enabled: Boolean(id),
  });

  if (!id) {
    return <ApiError message="No car ID was provided." />;
  }

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ApiError message={error.message} />;
  }

  if (!car) {
    return <ApiError message="Car not found." />;
  }



  return(
    <div className="flex items-center justify-center w-full min-h-[80vh]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-col">
        <h2 className="text-2xl font-semibold">
          Upload photos - {car.brand} {car.model}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" >
            <Link to={`/cars/${id}/edit`}>Back to edit</Link>
          </Button>
          <Button variant="ghost" >
            <Link to={`/cars/${id}`}>Car details</Link>
          </Button>
        </div>

        <CarPhotoUpload carId={id} />
      </div>
    </div>
  )


}