import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CarUiStore } from '../models/CarUiStore'

export const useCarUiStore = create<CarUiStore>()(
    persist(
        (set)=>({
            searchTerm: '',
            showFavoritesOnly: false,
            favoriteCarIds: [],


            //Search query
            setSearchTerm: (value: string)=>
                set({searchTerm: value}),



            //Flag for showing only favorite cars
            setShowFavoritesOnly: (value: boolean)=>
                set({showFavoritesOnly: value}),



            //Toggle favorite car
            toggleFavorite: (id: string)=> 
                set((state)=>({
                    favoriteCarIds: 
                        state.favoriteCarIds.includes(id)
                        ? state.favoriteCarIds.filter(
                            (carId) => carId !== id
                        )
                        : [...state.favoriteCarIds, id]
                })),



            //Remove a car from favorites
            removeFavorite: (id: string)=>
                set((state)=>({
                    favoriteCarIds: state.favoriteCarIds.filter(
                        (carId) => carId !== id
                    )
                })),


            //Clear favorites list
            clearFavorites: ()=>
                set({
                    favoriteCarIds: []
                })
        }),
        {
            name: 'car-ui-store',
            partialize: (state)=>({
                favoriteCarIds: state.favoriteCarIds
            })
        }
    )
)