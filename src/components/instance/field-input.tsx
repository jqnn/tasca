"use client";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import * as React from "react";
import type { InstanceField, TemplateField } from "@prisma/client";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import { useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash";

export default function FieldInput({
  instance,
  field,
  disabled,
}: {
  instance: InstanceField;
  field: TemplateField;
  disabled: boolean;
}) {
  const t = useTranslations();
  const [value, setValue] = React.useState<string>(instance.value);

  const updateMutation = api.instance.updateValue.useMutation({
    onError: () => showErrorToast(t),
    onSuccess: () => {
      instance.value = value;
    },
  });

  const updateMutationRef = React.useRef(updateMutation);
  const instanceIdRef = React.useRef(instance.id);

  React.useEffect(() => {
    updateMutationRef.current = updateMutation;
    instanceIdRef.current = instance.id;
  }, [updateMutation, instance.id]);

  const debouncedUpdate = React.useMemo<
    DebouncedFunc<(value: string) => void>
  >(() => {
    return debounce((newValue: string) => {
      updateMutationRef.current.mutate({
        id: instanceIdRef.current,
        value: newValue,
      });
    }, 350);
  }, []);

  React.useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <div className="grid w-full grid-cols-4 items-center gap-2">
      <Label className="mr-auto ml-auto" htmlFor={String(instance.id)}>
        {field.label}
      </Label>
      <Input
        id={String(instance.id)}
        value={value}
        className="col-span-3"
        placeholder={field.placeHolder ?? field.label}
        type={field.fieldType}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}
