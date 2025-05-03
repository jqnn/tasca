"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { TeamProcessesTable } from "~/app/dashboard/teams/[id]/(users)/processes/processes-table";
import { ChildrenHeader, SiteTitle } from "~/components/ui/site-header";
import { useTranslations } from "next-intl";

export default function TeamProcessesPage() {
  const t = useTranslations();
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  return (
    <>
      <ChildrenHeader>
        <SiteTitle title={t("team.navigation.processes")} />
      </ChildrenHeader>

      <TeamProcessesTable />
    </>
  );
}
