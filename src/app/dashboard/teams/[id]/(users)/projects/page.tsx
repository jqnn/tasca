"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { TeamProjectsTable } from "~/app/dashboard/teams/[id]/(users)/projects/projects-table";
import { ChildrenHeader, SiteTitle } from "~/components/ui/site-header";
import { useTranslations } from "next-intl";

export default function TeamProcessesPage() {
  const t = useTranslations()
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  return (
    <>
      <ChildrenHeader>
        <SiteTitle title={t("team.navigation.projects")} />
      </ChildrenHeader>

      <TeamProjectsTable />
    </>
  );
}
