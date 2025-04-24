"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import TeamTemplatesTable from "~/app/dashboard/teams/[id]/(owner)/templates/templates-table";

export default function TeamTemplatesPage() {
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  if (team.userRole != "OWNER") {
    return notFound();
  }

  return <TeamTemplatesTable />;
}
