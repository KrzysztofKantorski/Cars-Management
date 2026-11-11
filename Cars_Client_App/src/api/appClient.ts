import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";


//Axios config
export const appClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers:{
        Accept: "application/json",
        'Content': 'application/json'
    }
})




//Axios request interceptor
appClient.interceptors.request.use(
    (config)=>
    {
        const user = useAuthStore.getState().user;

        //Add token if missing
        if(user?.token){
            config.headers.Authorization = `Bearer ${user.token}`
        }
        
        return config;
    },

    (error)=>
    {
        return Promise.reject(error);
    }
   
)



//Axios response interceptor
appClient.interceptors.response.use(
    (response)=>response,
    (error)=>{

        //Token expired
        if (error.response?.status === 401) {
            useAuthStore
            .getState()
            .logout();
        }

        return Promise.reject(error);
    }
)



