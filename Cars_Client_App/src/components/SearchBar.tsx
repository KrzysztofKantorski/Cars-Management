import { Input } from "./ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Checkbox } from "./ui/checkbox";
import { useCarUiStore } from "../store/useCarUiStore";

function SearchBar(){
    const setSearchTerm = useCarUiStore((state)=> state.setSearchTerm);
    const setShowFavoritesOnly = useCarUiStore((state)=> state.setShowFavoritesOnly);
    const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
    const searchTerm = useCarUiStore((state) => state.searchTerm);
    return(
        <>
        <div className="w-full flex items-center  justify-center gap-[1rem] p-[2rem]">
            <FieldGroup className="max-w-md flex items-center flex-row">
                <Field >
                    <Input
                        className="bg-accent"
                        id="user-search"
                        type="text"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Field>
                <Field orientation="horizontal">
                    <Checkbox 
                        id="terms-checkbox-basic" 
                        name="terms-checkbox-basic"  
                        checked={showFavoritesOnly}
                        onCheckedChange={(checked) => setShowFavoritesOnly(!!checked)}
                        />
                    <FieldLabel htmlFor="terms-checkbox-basic">
                        Show favorites only
                    </FieldLabel>
                </Field>
            </FieldGroup>
        </div>
           
            


        </>
    )
}

export default SearchBar;