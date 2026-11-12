import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import ApiError from "../components/ApiError";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { login } from "../services/authService";
import { AuthForm } from "../components/AuthForm";

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

            <AuthForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitText="Login"
                submittingText="Logging..."
            >
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" value={email} onChange={handleEmailChange} required />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" value={password} onChange={handlePasswordChange} required />
                </Field>
            </AuthForm>


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