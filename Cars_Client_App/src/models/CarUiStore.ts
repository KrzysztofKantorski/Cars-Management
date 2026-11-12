export interface CarUiStore {
   searchTerm: string;
showFavoritesOnly: boolean;
favoriteCarIdsByUser:
Record<string, string[]>;

setSearchTerm:(value: string) => void;
removeCarFromAllFavorites: (carId: string) => void;
setShowFavoritesOnly:(value: boolean) => void;
toggleFavorite:(userId: string,carId: string,) => void;
removeFavorite:(userId: string, carId: string,) => void;
clearFavorites:(userId: string) => void;
}