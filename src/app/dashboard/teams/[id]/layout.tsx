import "~/styles/globals.css";

import { type Metadata } from "next";
import React, { type ReactNode } from "react";
import { TeamProvider } from "~/context/TeamProvider";
import Spinner from "~/components/ui/spinner";
import {
  SiteDescription,
  SiteHeader,
  SiteTitle,
} from "~/components/ui/site-header";
import { TeamNavigationComponent } from "~/components/navigation/team-navigation";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Tasca | Dashboard",
  description: "Task-Management",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  const team = await api.team.find({
    id: Number(id),
  });

  if (!team) {
    return notFound();
  }

  const title = team.personal
    ? (team.createdBy.displayName ?? team.createdBy.userName)
    : team.name;

  const description = team.personal ? "persönliches Team" : team.description;

  return (
    <TeamProvider project={team}>
      <SiteHeader>
        <SiteTitle title={`Team - ${title}`} />
        {description && <SiteDescription description={description} />}
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <TeamNavigationComponent teamId={team.id} />
          {children}
        </div>
      </main>
    </TeamProvider>
  );
}
