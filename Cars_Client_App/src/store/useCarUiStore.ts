import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CarUiStore } from '../models/CarUiStore'

export const useCarUiStore = create<CarUiStore>()(
    persist(
        (set)=>({
            searchTerm: '',
            showFavoritesOnly: false,
            favoriteCarIdsByUser: {},


            //Search query
            setSearchTerm: (value: string)=>
                set({searchTerm: value}),



            //Flag for showing only favorite cars
            setShowFavoritesOnly: (value: boolean)=>
                set({showFavoritesOnly: value}),



            //Toggle favorite car
            toggleFavorite: (userId: string, carId: string)=> 
                set((state)=>{
                    const current = state.favoriteCarIdsByUser[userId] ?? [];
                    const updated = current.includes(carId) ? current.filter((id) =>id !== carId): [...current,carId];

                    return {
                        favoriteCarIdsByUser: {
                        ...state.favoriteCarIdsByUser,
                        [userId]:
                        updated,
                        },
                    };
                }),




            //Remove a car from favorites
           removeFavorite:(userId, carId) =>
                set((state) => {
                    const current =state.favoriteCarIdsByUser[userId] ?? [];
                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]:
                            current.filter(
                                (id) =>
                                id !== carId,
                            ),
                        },
                    };
                }),

            //Clear favorites list
            clearFavorites: (userId)=>
               set((state) => ({
                    favoriteCarIdsByUser: {
                    ...state.favoriteCarIdsByUser,
                    [userId]: [],
                    },
                })),
        }),
        {
            name: 'car-ui-store',
            partialize: (state)=>({
                favoriteCarIdsByUser: state.favoriteCarIdsByUser
            })
        }
    )
)