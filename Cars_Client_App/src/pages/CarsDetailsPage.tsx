import { Link, useParams } from "react-router";
import { deleteCarPhoto, getCarById } from "../services/carService";
import ApiError from "../components/ApiError";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { queryKeys } from "../queries/queryKeys";
import { Button } from "../components/ui/button";
import Loading from "../components/Loading";


function CarsDetailsPage() {

  //Get id param from route
  const { id } = useParams();
  
  const carId = id ?? "";


  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  //Check if user is admin
  const isAdmin = user?.roles.includes("Admin") ?? false;



  //Get car details
  const {
    data: car,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.car(carId),
    queryFn: ({ signal }) => getCarById(carId, signal),
    //If id does not exist, dont exexute
    enabled: Boolean(id),
  });


  //Delete photo (only admin)
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => deleteCarPhoto(carId, photoId),
    //Update data
    onSuccess: () => {
      queryClient.invalidateQueries({
      queryKey: queryKeys.car(carId),
      });
    },
  });

  


  function handleDeletePhoto(photoId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );
    if (!confirmed) return;

    deletePhotoMutation.mutate(photoId);
  }


  
  if(!id){
    return(
      <section>
        <h1>Error</h1>
        <ApiError message={error.message}></ApiError>
        <Link className="btn btn-secondary" to="/cars">
          Back to car list
        </Link>
      </section>
    )
  }

  if (isError) {
    return (
      <section>
        <h1>Error</h1>
        <ApiError message={error.message}></ApiError>
        <Link className="btn btn-secondary" to="/cars">
          Back to car list
        </Link>
      </section>
    );
  }

  if (car == null) 
  {
    return (
      <section>
        <p>No cars found.</p>
         <Link className="btn btn-secondary" to="/cars">
          Back to car list
        </Link>
      </section>
    )
  }

  if(isPending){
    return (
      <Loading></Loading>
    )
  }



  //Get car main photo
  const mainPhoto = car.photos?.find((photo) => photo.isMain) ?? car.photos?.[0];

  return(
    <>
    <div className="flex items-center justify-center w-full min-h-[80vh] flex-col gap-[2rem] mt-[5rem]">

      <h1 className="text-4xl">
        {car.brand} {car.model}
      </h1>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <>
            <Button variant="outline" >
              <Link to={`/cars/${car.id}/edit`}>Edit car</Link>
            </Button>
            <Button variant="outline">
              <Link to={`/cars/${car.id}/photos`}>Add photos</Link>
            </Button>
          </>
        )}

        <Button variant="ghost" >
          <Link to="/cars">Back to list</Link>
        </Button>
      </div>

      {/* Delete image error */}
      {deletePhotoMutation.isError && (
        <ApiError message={deletePhotoMutation.error.message} />
      )}


      {mainPhoto ? (
        <div className="w-full overflow-hidden rounded-lg flex items-center justify-center">
          <img
            src={mainPhoto.url}
            alt={`${car.brand} ${car.model}`}
            className=" max-h-[420px] object-cover"
          />
        </div>
      ) : (
        <div className="w-full rounded-lg p-12 text-center text-muted-foreground">
          No main photo available
        </div>
      )}


      {/*Car basic data*/}

      <Table className="w-[50%] ml-[25%] bg-card p-[2rem]">
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead  className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell className="text-right">{car.brand}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell className="text-right">{car.model}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Doors number</TableCell>
            <TableCell className="text-right">{car.doorsNumber}</TableCell>
          </TableRow>


          <TableRow>
            <TableCell>Luggage capacity</TableCell>
            <TableCell className="text-right">{car.luggageCapacity}</TableCell>
          </TableRow>


          <TableRow>
            <TableCell>Engine capacity</TableCell>
            <TableCell className="text-right">{car.engineCapacity}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Fuel type</TableCell>
            <TableCell className="text-right">{car.fuelType}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Production date</TableCell>
            <TableCell className="text-right">{car.productionDate}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Avg fuel consumption</TableCell>
            <TableCell className="text-right">{car.averageFuelConsumption}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Body type</TableCell>
            <TableCell className="text-right ">{car.bodyType}</TableCell>
          </TableRow>
        </TableBody>
      </Table>




       {/*Car features data*/}
       <div className="bg-card rounded-lg p-6 w-[50%]">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        {!car.features || car.features.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No features assigned to this car.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {car.features.map((feature) => (
              <span
                key={feature.id}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {feature.name}
              </span>
            ))}
          </div>
        )}
      </div>



      {/*Photo gallery*/}
      <div className="p-20 min-h-[100vh] flex items-center flex-col">
        <h1 className="text-4xl font-semibold mb-4">Photo gallery</h1>

        
          {!car.photos || car.photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No photos uploaded for this car.
            </p>
          ) : (
            <div className="mt-[5rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-content-center">
              {car.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="border border-border rounded-md overflow-hidden flex flex-col justify-between max-w-[250px] min-w-[200px]"
                >
                  <img
                    src={photo.url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 flex flex-col gap-2">
                    {photo.isMain && (
                      <span className="self-start px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                        Main
                      </span>
                    )}

                    {isAdmin && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        disabled={deletePhotoMutation.isPending}
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        {deletePhotoMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
          )}
      </div>

    </div>
    </>
  )
}


export default CarsDetailsPage