"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { TeamProcessesTable } from "~/app/dashboard/teams/[id]/(users)/processes/processes-table";

export default function TeamProcessesPage() {
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  return <TeamProcessesTable />;
}
