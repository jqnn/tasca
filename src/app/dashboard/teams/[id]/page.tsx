"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";

export default function ProjectPage() {
  const team = useTeam()
  if(!(team)) {
    return notFound()
  }

  return (
    <p>{team.name}</p>
  );
}
