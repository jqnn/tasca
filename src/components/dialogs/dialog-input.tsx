import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { HTMLInputTypeAttribute } from "react";
import * as React from "react";

export default function DialogInput({
  id,
  label,
  placeHolder,
  required = false,
  setValue,
  min,
  max,
  type,
}: {
  id: string;
  label: string;
  placeHolder?: string | null;
  required?: boolean;
  setValue: (open: string) => void;
  min?: number | string;
  max?: number | string;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        className="col-span-3"
        placeholder={placeHolder ?? ""}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        min={min}
        max={max}
        type={type ?? "text"}
      />
    </div>
  );
}
