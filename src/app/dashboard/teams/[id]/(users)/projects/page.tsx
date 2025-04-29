"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { TeamProjectsTable } from "~/app/dashboard/teams/[id]/(users)/projects/projects-table";

export default function TeamProcessesPage() {
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  return <TeamProjectsTable />;
}
