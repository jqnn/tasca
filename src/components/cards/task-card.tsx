"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type FieldType,
  InstanceStatus,
  type InstanceTask,
  type Role,
} from "@prisma/client";
import { beautifyInstanceStatus } from "~/lib/utils";
import { useTranslations } from "next-intl";
import { Progress } from "~/components/ui/progress";

interface PageProps {
  task: {
    InstanceField: ({
      field: {
        fieldType: FieldType;
        id: number;
        label: string;
        order: number;
        placeHolder: string | null;
        templateId: number;
      };
    } & {
      fieldId: number;
      id: number;
      instanceId: number;
      updatedAt: Date;
      value: string;
    })[];
    InstanceTask: InstanceTask[];
    createdBy: {
      authMethodId: number;
      createdAt: Date;
      displayName: string | null;
      id: number;
      password: string | null;
      role: Role;
      userName: string;
    } | null;
    template: {
      createdAt: Date;
      createdById: number | null;
      description: string | null;
      id: number;
      name: string;
    };
  } & {
    createdAt: Date;
    createdById: number | null;
    id: number;
    status: InstanceStatus;
    templateId: number;
    teamId: number;
  };
  filter: string;
}

export function TaskCardComponent({ task, filter }: PageProps) {
  const t = useTranslations();
  const field = task.InstanceField.sort(
    (a, b) => a.field.order - b.field.order,
  );

  const firstField = field[0];
  const title =
    firstField && firstField.value != ""
      ? firstField.field.label + " - " + firstField.value
      : task.template.name;

  if (!title.toLowerCase().includes(filter.toLowerCase())) {
    return;
  }

  let progress =
    (task.InstanceTask.filter((task) => task.status == InstanceStatus.COMPLETED)
      .length /
      task.InstanceTask.length) *
    100;

  if(!(progress)) progress = 0;

  return (
    <Link
      key={task.id}
      href={`/dashboard/teams/${task.teamId}/processes/${task.id}`}
    >
      <Card key={task.id}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <p>
              {t("common.creator")} -{" "}
              {task.createdBy
                ? (task.createdBy.displayName ?? task.createdBy.userName)
                : t("common.unknown")}
            </p>
            <p>{t("common.state")} - {beautifyInstanceStatus(t, task.status)}</p>
            <p>{t("common.progress")} ({progress}/100)</p>
            <Progress
              className={"bg-secondary w-full"}
              value={progress}
            />
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
