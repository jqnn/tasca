"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";

export default function TeamTemplatesPage() {
  const team = useTeam()
  if(!(team)) {
    return notFound()
  }

  if(team.userRole != "OWNER") {
    return notFound()
  }

  return (
    <p>TODO</p>
  );
}
