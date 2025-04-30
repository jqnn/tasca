"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import TeamTemplatesTable from "~/app/dashboard/teams/[id]/(owner)/templates/templates-table";
import { ChildrenHeader, SiteTitle } from "~/components/ui/site-header";
import { useTranslations } from "next-intl";

export default function TeamTemplatesPage() {
  const t = useTranslations()
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  if (team.userRole == "MEMBER") {
    return notFound();
  }
  return (
    <>
      <ChildrenHeader>
        <SiteTitle title={t("team.navigation.templates")} />
      </ChildrenHeader>

      <TeamTemplatesTable />
    </>
  );
}
