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
}: {
  instance: InstanceField;
  field: TemplateField;
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
  });

  const [value, setValue] = React.useState<string>("");

  return (
    <div className="grid grid-cols-5 gap-4 w-full">
      <Label className={"ml-auto mr-auto"} htmlFor={String(instance.id)}>{field.label}</Label>
      <Input
        id={String(instance.id)}
        value={instance.value}
        className={"col-span-4"}
        placeholder={field.placeHolder ?? field.label}
        type={field.fieldType}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
