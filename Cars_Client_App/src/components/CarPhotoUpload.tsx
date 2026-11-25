import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { uploadCarPhoto } from "../services/carService";
import { queryKeys } from "../queries/queryKeys";
import ApiError from "./ApiError";
import { FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CarPhotoProps {
  carId: string;
}



export default function CarPhotoUpload({carId}: CarPhotoProps){

    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    //Upload photo
    const uploadMutation = useMutation({
        mutationFn: (selectedFile: File) => uploadCarPhoto(carId, selectedFile),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.car(carId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.cars });
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        },
    });

    
    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0] ?? null;
        setFile(selectedFile);
    }


    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!file) return;
        uploadMutation.mutate(file);
    }


    return(
        <div className="flex items-start justify-center w-full mt-[2rem]">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-full max-w-3xl space-y-4 bg-card p-[2rem] rounded-md border border-border"
            >

                <h3 className="text-lg font-semibold align-center">Upload car photo</h3>

                {uploadMutation.isError && (
                    <ApiError message={uploadMutation.error.message} />
                )}

               
                <FieldLabel htmlFor="car-photo">Select image (JPG, PNG, WebP)</FieldLabel>
                <Input
                    ref={fileInputRef}
                    id="car-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                />

                <Button
                type="submit"
                variant="outline"
                disabled={!file || uploadMutation.isPending}
                className="mt-[1rem]"
                >
                    {uploadMutation.isPending ? "Uploading..." : "Upload photo"}
                </Button>
               
            </form>
        </div>
    )
}