import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../services/authService";
import ApiError from "../components/ApiError";
import { AuthForm } from "../components/AuthForm";
import { Input } from "../components/ui/input";
import { Field, FieldLabel } from "../components/ui/field";
import { Button } from "../components/ui/button";


export default function ResetPasswordPage(){
    const [searchParams] = useSearchParams();
    const email =searchParams.get("email");
    const token =searchParams.get("token");
    const [newPassword, setNewPassword] =useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) 
    {
        setNewPassword(event.target.value);
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
            const result = await resetPassword(email, token, newPassword);
            setMessage(result);
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

    if(!email || !token)
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
            <h1>Set new password</h1>
            {message && <p>{message}</p>}
            {error && <ApiError message={error} />}

            <AuthForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitText="Reset"
                submittingText="Resetting..."
            >
                <Field>
                  <FieldLabel htmlFor="newpassword">New password</FieldLabel>
                    <Input
                        id="newpassword"
                        name="newpassword"
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                </Field>
            </AuthForm>


            <Button variant="outline" size="sm" onClick={() => goToPage(`/login`)}>
                Login
            </Button>
        </div>
        
    )
}