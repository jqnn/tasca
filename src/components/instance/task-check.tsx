"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import type { InstanceTask, ProjectTask } from "@prisma/client";
import { Checkbox } from "~/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useTranslations } from "next-intl";

export function TaskCheck({
  instance,
  disabled,
}: {
  instance: InstanceTask;
  disabled: boolean;
}) {
  const t = useTranslations();

  const handleCheckedChange = (value: CheckedState) => {
    const checked = value as boolean;

    updateMutation.mutate({
      id: instance.id,
      value: checked,
    });
  };

  const updateMutation = api.instance.updateState.useMutation({
    onError: () => {
      showErrorToast(t);
    },
    onSuccess: (data) => {
      instance.status = data.status;
    },
  });

  return (
    <div className={"flex justify-center"}>
      <Checkbox
        checked={instance.status == "COMPLETED"}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}

export function ProjectTaskCheck({ task }: { task: ProjectTask }) {
  const t = useTranslations();

  const handleCheckedChange = (value: CheckedState) => {
    const checked = value as boolean;

    updateMutation.mutate({
      id: task.id,
      value: checked,
    });
  };

  const updateMutation = api.teamProjects.updateState.useMutation({
    onError: () => {
      showErrorToast(t);
    },
    onSuccess: (data) => {
      task.status = data.status;
    },
  });

  return (
    <div className={"flex justify-center"}>
      <Checkbox
        checked={task.status == "COMPLETED"}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
