interface ErrorProps 
{
  message: string;
}

function ApiError({message}: ErrorProps)
{
    return(
        <p className="error">{message}</p>
    )
}

export default ApiError;