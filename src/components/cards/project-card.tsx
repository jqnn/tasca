"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface PageProps {
  project: {
    name: string;
    id: number;
    createdById: number;
    teamId: number;
    description: string | null;
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
            <p>Ersteller - {project.createdById}</p>
            <p>Status - TODO</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
