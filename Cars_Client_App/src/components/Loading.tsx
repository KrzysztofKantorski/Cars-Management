import { Spinner } from "./ui/spinner";

function Loading()
{
  return (
    <div className="flex items-center justify-center w-full min-h-[80vh]">
      <Spinner className="size-6"></Spinner>
    </div>
  ) 
}

export default Loading;