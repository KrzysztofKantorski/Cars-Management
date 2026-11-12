import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { forgotPassword } from "../services/authService";
import ApiError from "../components/ApiError";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { AuthForm } from "../components/AuthForm";

export default function ForgotPasswordPage()
{
    const [email, setEmail] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setEmail(event.target.value);
    }


    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>)
    {
        event.preventDefault();
        
        try{
            setIsSubmitting(true);
            setError(null)
            await forgotPassword(email);
            navigate("/cars");
        }

        catch(err)
        {
            if (err instanceof Error) 
            {
                setError(err.message);
            }
        
            else{
                setError("Could not change password")
            }
        }
    
        finally{
            setIsSubmitting(false);
        }
    
    
    }


    return(
        <div className="w-full flex flex-col items-center justify-start pt-[8rem] gap-[3rem]">

            <h1>Change password</h1>
            {error && <ApiError message={`${error}`}></ApiError>}

           <AuthForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitText="Send reset link"
            >
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" value={email} onChange={handleEmailChange} required />
                </Field>
            </AuthForm>
        </div>
    );



}