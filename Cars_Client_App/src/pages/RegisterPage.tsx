import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { register } from "../services/authService";
import ApiError from "../components/ApiError";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


export default function RegisterPage(){
    const [email, setEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setEmail(event.target.value);
    }
    
    
    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setPassword(event.target.value);
    }


    function handleUserNameChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setUserName(event.target.value);
    }
    
    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>)
    {
        event.preventDefault();
    
        try{
            setIsSubmitting(true);
            setError(null)
            await register({userName, email, password});
            navigate("/confirm-email");
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
        <div className="w-full flex flex-col items-center justify-start pt-[8rem] gap-[3rem]">
            <h1>Register</h1>

            {error && <ApiError message={`${error}`}></ApiError>}

            <form onSubmit={handleSubmit} className="flex flex-col w-[30%] max-w-3xl space-y-6 bg-card p-[2rem] rounded-md bg-card">
                <FieldSet className="w-full" >
                     <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="username" type="text" value={userName} onChange={handleUserNameChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="email" type="text" value={email} onChange={handleEmailChange} required/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input autoComplete="off" placeholder="type..." name="password" type="text" value={password} onChange={handlePasswordChange} required/>
                        </Field>

                        <Button type="submit" variant="outline" className="w-[30%] ml-[35%] text-center mt-[2rem]">
                            {isSubmitting? 'Processing...': 'Register'}
                        </Button>
                     </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )


}