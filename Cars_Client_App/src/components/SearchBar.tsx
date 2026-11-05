import { Input } from "./ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Checkbox } from "./ui/checkbox";

function SearchBar(){


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
                    />
                </Field>
                <Field orientation="horizontal">
                    <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
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