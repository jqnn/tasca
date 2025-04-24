"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { FieldType, InstanceStatus, Role } from "@prisma/client";
import { beautifyInstanceStatus } from "~/lib/utils";

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
    createdBy: {
      authMethodId: number;
      createdAt: Date;
      displayName: string | null;
      id: number;
      password: string | null;
      role: Role;
      userName: string;
    };
    template: {
      createdAt: Date;
      createdById: number;
      description: string | null;
      id: number;
      name: string;
    };
  } & {
    createdAt: Date;
    createdById: number;
    id: number;
    status: InstanceStatus;
    templateId: number;
    teamId: number;
  };
}

export function TaskCardComponent({ task }: PageProps) {
  const field = task.InstanceField.sort(
    (a, b) => a.field.order - b.field.order,
  );

  const firstField = field[0];

  return (
    <Link
      key={task.id}
      href={`/dashboard/teams/${task.teamId}/processes/${task.id}`}
    >
      <Card key={task.id}>
        <CardHeader>
          <CardTitle>
            {firstField
              ? firstField.field.label + " - " + firstField.value
              : task.template.name}
          </CardTitle>
          <CardDescription>
            <p>
              Ersteller -{" "}
              {task.createdBy.displayName ?? task.createdBy.userName}
            </p>
            <p>Status - {beautifyInstanceStatus(task.status)}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
