import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { register } from "../services/authService";
import ApiError from "../components/ApiError";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AuthForm } from "../components/AuthForm";


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

            <AuthForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitText="Register"
            >
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" name="username" type="text" value={userName} onChange={handleUserNameChange} required />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" value={email} onChange={handleEmailChange} required />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" value={password} onChange={handlePasswordChange} required />
                </Field>
            </AuthForm>
        </div>
    )


}