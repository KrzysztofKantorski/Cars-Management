import { appClient } from "../api/appClient";
import type { LoginData, RegisterData, User } from "../models/Auth";



export async function login(
        data: LoginData 
    ): Promise<User>
{
    const response = await appClient.post<User>(
        '/account/login',
        data
    );

    return response.data
}



export async function register(
    data: RegisterData
): Promise<string>
{
    const response = await appClient.post<{message: string}>(
        '/account/register',
        data
    );

    return response.data.message
}



export async function confirmEmail(
    userId: string,
    token: string,
): Promise<string>
{
    const response = await appClient.post<{message: string}>(
        '/account/confirm-email',null,
        {
            params: 
            {
                userId,
                token,
            },
        },

    );

    return response.data.message
}






export async function forgotPassword(
    email: string
): Promise<string>
{
    const response = await appClient.post<{message: string}>(
        '/account/forgot-password',
        {email},
    );

    return response.data.message
}





export async function resetPassword(
    email: string,
    token: string,
    newPassword: string,
): Promise<string>
{
    const response = await appClient.post<{message: string}>(
        '/account/reset-password',
        {
            email,
            token,
            newPassword,
        },

    );

    return response.data.message
}