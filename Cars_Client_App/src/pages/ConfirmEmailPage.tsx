import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { confirmEmail } from "../services/authService";
import axios from "axios";


export default function ConfirmEmailPage(){
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const [message, setMessage] = useState('Confirming account...');

    const hasRequested = useRef(false);
    useEffect(()=>{
        if (!userId || !token || hasRequested.current) {
            return;
        }
        hasRequested.current = true;

        async function confirm() {
    try {
      const result = await confirmEmail(userId!, token!);
      setMessage(result);
    } catch (err) {
      // Jeśli to błąd sieciowy przy otwieraniu nowej karty (brak odpowiedzi z serwera), ponów raz po 300ms
      if (axios.isAxiosError(err) && !err.response) {
        try {
          await new Promise((r) => setTimeout(r, 300));
          const retryResult = await confirmEmail(userId!, token!);
          setMessage(retryResult);
          return;
        } catch {
          // Przejdź do wyświetlenia błędu niżej
        }
      }

      if (axios.isAxiosError(err) && err.response?.data) {
        setMessage(String(err.response.data));
      } else {
        setMessage("Could not confirm account");
      }
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