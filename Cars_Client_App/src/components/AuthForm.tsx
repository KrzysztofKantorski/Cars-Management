import type { ReactNode, SyntheticEvent } from "react";
import { FieldGroup, FieldSet } from "./ui/field";
import { Button } from "./ui/button";

interface AuthFormProps {
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitText: string;
  submittingText?: string;
  children: ReactNode;
}


export function AuthForm({
  onSubmit,
  isSubmitting,
  submitText,
  submittingText = "Processing...",
  children,
}: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full max-w-md space-y-6 bg-card p-8 rounded-md border"
    >
      <FieldSet className="w-full">
        <FieldGroup>
          {children}

          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            className="w-1/2 mx-auto mt-6"
          >
            {isSubmitting ? submittingText : submitText}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}