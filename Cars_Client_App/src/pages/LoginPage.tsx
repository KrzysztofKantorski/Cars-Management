import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import ApiError from "../components/ApiError";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { login } from "../services/authService";

export default function LoginPage(){
    const navigate = useNavigate();
    const setUser = useAuthStore((state)=> state.setUser);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);



    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setEmail(event.target.value);
    }


    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setPassword(event.target.value);
    }

    function goToPage(route: string){
        navigate(route);
    }


    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>)
    {
        event.preventDefault();

        try{
            setIsSubmitting(true);
            setError(null)

            const user = await login({email, password});


            setUser(user);

            navigate("/cars");
        }
        catch(err)
        {
            if (err instanceof Error) 
            {
                setError(err.message);
            }

            else{
                setError("Could not login")
            }
        }
        finally{
            setIsSubmitting(false);
        }
    }


    return(
        <div className="w-full flex flex-col items-center justify-start mt-[8rem] gap-[3rem]">
            <h1>Login</h1>

            {error && <ApiError message={`${error}`}></ApiError>}

            <form onSubmit={handleSubmit} className="flex flex-col w-[30%] max-w-3xl space-y-6 bg-card p-[2rem] rounded-md bg-card">
                <FieldSet className="w-full" >
                     <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="email" type="text" value={email} onChange={handleEmailChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="password" type="text" value={password} onChange={handlePasswordChange} required/>
                        </Field>

                         <Button type="submit" variant="outline" className="w-[30%] ml-[35%] text-center mt-[2rem]">{isSubmitting? 'Logging...': 'Login'}</Button>
                     </FieldGroup>
                </FieldSet>
            </form>


            <div className="flex gap-[2rem]">
                <Button variant="outline" size="sm" onClick={() => goToPage(`/forgot-password`)}>
                    Forgot password?
                </Button>

                <Button variant="outline" size="sm" onClick={() => goToPage(`/register`)}>
                    Register
                </Button>
            </div>
        
        </div>
    );
}