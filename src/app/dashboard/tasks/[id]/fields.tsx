"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import FieldInput from "~/components/instance/field-input";
import type { FieldType } from "@prisma/client";

type InstanceType = {
  field: {
    id: number;
    label: string;
    placeHolder: string | null;
    fieldType: FieldType;
    order: number;
    templateId: number;
  };
  id: number;
  value: string;
  updatedAt: Date;
  fieldId: number;
  instanceId: number;
};

interface TaskFieldsProps {
  instances: InstanceType[];
}

export function TaskFields({ instances }: TaskFieldsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/")
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {instances.map((field) => (
        <FieldInput key={field.id} field={field.field} instance={field} />
      ))}
    </div>
  );
}
