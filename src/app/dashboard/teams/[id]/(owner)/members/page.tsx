"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import TeamMembersTable from "~/app/dashboard/teams/[id]/(owner)/members/members-table";

export default function TeamMembersPage() {
  const team = useTeam()
  if(!(team)) {
    return notFound()
  }

  if(team.userRole != "OWNER") {
    return notFound()
  }

  return (
    <TeamMembersTable />
  );
}
