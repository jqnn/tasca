"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { type ComponentProps } from "react";
import { cn } from "~/lib/utils";

interface ControlledInputProps extends ComponentProps<"input"> {
  id: string;
  name: string;
  label: string;
}

function ControlledInput({ id, name, label, ...props }: ControlledInputProps) {
  const form = useFormContext();
  const required = props.required ?? true;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            {label}
            {required && "*"}
          </FieldLabel>
          <Input
            {...field}
            {...props}
            id={id}
            aria-invalid={fieldState.invalid}
            autoComplete="off"
            className={cn("w-full", props.className)}
            required={required}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { ControlledInput };
