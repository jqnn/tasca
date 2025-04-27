"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { TeamDashboardCardsComponent } from "~/components/cards/team-dashboard-cards";
import { TeamDashboardStatsChartComponent } from "~/components/charts/team-stats-chart";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";

export default function ProjectPage() {
  const team = useTeam();
  if (!team) {
    return notFound();
  }

  const { data: data, status: status } = api.teamStats.findCounts.useQuery({
    id: team.team.id,
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className={"grid w-full grid-cols-1 gap-10"}>
      <TeamDashboardCardsComponent
        openProcessCount={data.processes}
        memberCount={data.members}
        templateCount={data.templates}
      />
      <TeamDashboardStatsChartComponent />
    </div>
  );
}
