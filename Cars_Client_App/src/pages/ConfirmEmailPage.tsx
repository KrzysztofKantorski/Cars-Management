import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { confirmEmail } from "../services/authService";


export default function ConfirmEmailPage(){
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const [message, setMessage] = useState('Confirming account...');


    useEffect(()=>{
        if(!userId || !token)
        {
           return;
        }

        async function confirm(){
            try{
                const result = await confirmEmail(userId!, token!);
                setMessage(result);
            }
            catch{
                setMessage("Could not confirm account");
            }
        }

        confirm();
    }, [userId, token])


    if(!userId || !token)
    {
        return (
            <section>
                <h1>Incorrect link</h1>
                <Link to="/login">
                    Go to login
                </Link>
            </section>
        );
    }


    return(
        <div className="w-full flex flex-col items-center justify-start mt-[8rem] gap-[3rem]">
            <h1>Account confirmation</h1>
            <p>{message}</p>
            <Link to="/login">
                Go to login
            </Link>
        </div>
    )
}