export interface CarUiStore {
    searchTerm: string;
    showFavoritesOnly: boolean;
    favoriteCarIds: string[];
    setSearchTerm: (value: string)=> void;
    setShowFavoritesOnly: (value: boolean)=> void;
    toggleFavorite: (id: string)=> void;
    removeFavorite: (id: string)=> void;
    clearFavorites: ()=> void;
}