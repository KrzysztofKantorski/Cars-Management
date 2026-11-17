import { useNavigate } from "react-router";
import { Button } from "../components/ui/button"
import { DitherField } from "../components/ui/dither-field"

function HomePage() {
  const navigate = useNavigate();
  function goToPage(route: string) {
    console.log("siup");
    navigate(route);
  }

  return (
    <>
      <DitherField className="h-[91vh] fixed top-0 bottom-0 left-0 right-0">
       <div className="relative h-[100%] w-full flex items-center justify-center flex-col">
        <h1 className="text-6xl font-bold mb-[3rem]">Cars management system</h1>

        <p className="text-2xl mb-[3rem]">You can browse, add, edit and delete cars</p>

        <Button variant="outline" size="lg"  onClick={() => goToPage(`/cars`)}>
          Browse cars 
        </Button>
       </div>

        
        
      </DitherField>
      
    </>
  )
}

export default HomePage