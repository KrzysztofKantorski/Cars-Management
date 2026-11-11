import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore } from "../models/AuthStore"



export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({


            user: null,

            setUser: (user) => set({user}),

            logout: () =>{
                set({user: null})
            }


        }),
        {
            name: "cars-auth-store",
        },
    )
)
