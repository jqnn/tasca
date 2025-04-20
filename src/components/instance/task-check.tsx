"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import type { InstanceTask } from "@prisma/client";
import { Checkbox } from "~/components/ui/checkbox";

export default function TaskCheck({ instance }: { instance: InstanceTask }) {
  const handleBlur = () => {
    updateMutation.mutate({
      id: instance.id,
      value: value,
    });
  };

  const updateMutation = api.instance.updateState.useMutation({
    onError: () => {
      showErrorToast();
    },
  });

  const [value, setValue] = React.useState<boolean>(
    instance.status == "COMPLETED",
  );

  return (
    <div className={"flex justify-center"}>
      <Checkbox
        checked={value}
        onCheckedChange={(e) => setValue(e as boolean)}
        onBlur={handleBlur}
      />
    </div>
  );
}
