import axios from "axios";


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
        console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`)
        return config;
    },

    (error)=>
    {
        return Promise.reject(error);
    }
   
)



//Axios response interceptor
appClient.interceptors.response.use(
    (response)=>{
        console.log(`[Axios] ${response.status} ${response.config.url}`)
        return response;
    },
    (error)=>{
        return Promise.reject(error)
    }
)



