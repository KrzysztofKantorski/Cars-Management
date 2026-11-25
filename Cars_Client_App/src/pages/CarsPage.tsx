import { deleteCar, getCars } from "../services/carService";
import Card from "../components/Card";
import Loading from "../components/Loading";
import ApiError from "../components/ApiError";
import {useCarUiStore} from "../store/useCarUiStore";
import SearchBar from "../components/SearchBar";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queries/queryKeys";

const EMPTY_FAVORITES: string[] = [];

function CarsPage() {

    const queryClient = useQueryClient();

    //Get cars
    const {
        data: cars = [],
        isPending,
        isError,
        error,
        } = useQuery({
        queryKey: queryKeys.cars,
        queryFn: ({ signal }) => getCars(signal),
    });


    //Global state for favorite cars
 
    const searchTerm = useCarUiStore((state)=> state.searchTerm);
    const showFavoritesOnly = useCarUiStore((state)=> state.showFavoritesOnly);
   
    const user =useAuthStore((state) => state.user);

    const isAdmin = user?.roles?.includes("Admin") ?? false;

    const favoriteCarIdsByUser =useCarUiStore((state) => state.favoriteCarIdsByUser);
    const favoriteCarIds= user ? (favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES) : EMPTY_FAVORITES;
    //Remove car from global state
    const removeFavorite = useCarUiStore(
        (state) => state.removeCarFromAllFavorites
    );

    //Normalize search query
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const visibleCars = cars.filter((car)=>{

        //Check if car matches search query and favorite filter
        const matchesSearch = 
            car.brand.toLowerCase().includes(normalizedSearch)
            || 
            car.model.toLowerCase().includes(normalizedSearch);
        
        const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);

        return matchesSearch && matchesFavorite;

    })


    //Delete car
    const deleteMutation = useMutation({

        //Call api delete function
        mutationFn: deleteCar,
        onSuccess: (_data, deletedCarId) => {

            //Remove car from user favorites
            if (user) {
                removeFavorite(deletedCarId);
            }

            //Refresh car list
            queryClient.invalidateQueries({
                queryKey: queryKeys.cars,
            });
        }

    })

    function handleDelete(id: string) {

        const confirmed = window.confirm("Confirm if you want to delete this car",);
        
        if (!confirmed) {
            return;
        }

        //Call mutation
        deleteMutation.mutate(id);
    }

    
    if (isPending) 
    {
        return <Loading/>;
    }

    if (isError) 
    {
        return <ApiError message={error.message}/>;
    }

    if (cars.length === 0) 
    {
        return <p>No cars found.</p>;
    }



    return (
        <>
        <div className="flex items-center justify-center w-[70%] ml-[15%] pb-[5rem] min-h-[100vh] flex-col gap-[1rem]">
            {deleteMutation.isError && (
                    <ApiError message={deleteMutation.error.message}/>
                )}
                <SearchBar>
                </SearchBar>   

                <p className="text-sm text-muted-foreground">
                    Showing {visibleCars.length} of {cars.length} cars
                </p> 
            <div className="flex flex-wrap items-center justify-center gap-[2rem]">
                

                {visibleCars.length === 0 ? 
                (
                    <p className="text-muted-foreground">No cars match your filters.</p>
                ) 
                : 
                (
                    <div className="flex flex-wrap items-center justify-center gap-[2rem] w-full">
                    {visibleCars.map((car) => (
                        <Card
                        key={car.id}
                        car={car}
                        onRemove={isAdmin ? handleDelete : undefined}
                        />
                    ))}
                    </div>
                )}
            </div>
        </div>  
            
        </>
    )
}

export default CarsPage