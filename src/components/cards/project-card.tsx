"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { beautifyInstanceStatus } from "~/lib/utils";
import type { InstanceStatus } from "@prisma/client";

interface PageProps {
  project: {
    name: string;
    id: number;
    createdById: number | null;
    teamId: number;
    description: string | null;
    status: InstanceStatus;
  };
}

export function ProjectCardComponent({ project }: PageProps) {
  return (
    <Link
      key={project.id}
      href={`/dashboard/teams/${project.teamId}/projects/${project.id}`}
    >
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            {project.description && <p>Beschreibung - {project.description}</p>}
            <p>Status - {beautifyInstanceStatus(project.status)}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
