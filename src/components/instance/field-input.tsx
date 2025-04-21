"use client";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import * as React from "react";
import type { InstanceField, TemplateField } from "@prisma/client";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";

export default function FieldInput({
  instance,
  field,
  disabled,
}: {
  instance: InstanceField;
  field: TemplateField;
  disabled: boolean;
}) {
  const handleBlur = () => {
    updateMutation.mutate({
      id: instance.id,
      value: value,
    });
  };

  const updateMutation = api.instance.updateValue.useMutation({
    onError: () => {
      showErrorToast();
    },
    onSuccess: () => {
      instance.value = value;
    },
  });

  const [value, setValue] = React.useState<string>(instance.value);

  return (
    <div className="grid w-full grid-cols-4">
      <Label className={"mr-auto ml-auto"} htmlFor={String(instance.id)}>
        {field.label}
      </Label>
      <Input
        id={String(instance.id)}
        value={value}
        className={"col-span-3"}
        placeholder={field.placeHolder ?? field.label}
        type={field.fieldType}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
