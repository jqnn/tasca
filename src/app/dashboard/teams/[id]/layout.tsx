import "~/styles/globals.css";

import { type Metadata } from "next";
import React, { type ReactNode } from "react";
import { TeamProvider } from "~/context/TeamProvider";
import {
  SiteDescription,
  SiteHeader,
  SiteTitle,
} from "~/components/ui/site-header";
import { TeamNavigationComponent } from "~/components/navigation/team-navigation";
import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";

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
  params: Promise<{
    id: string;
  }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const actualParams = await params;
  const { id } = actualParams;
  const team = await api.team.find({
    id: Number(id),
  });

  if (!team) {
    return notFound();
  }

  const role = await api.teamMember.getRole({
    userId: Number(session.user.id),
    teamId: team.id,
  });

  if (!role) {
    return notFound();
  }

  const title = team.personal
    ? (team.createdBy ? ((team.createdBy.displayName ?? team.createdBy.userName)) : "Unbekannt")
    : team.name;

  const description = team.personal ? "persönliches Team" : team.description;

  return (
    <TeamProvider team={team} userRole={role}>
      <SiteHeader>
        <SiteTitle title={`Team - ${title}`} />
        {description && <SiteDescription description={description} />}
        <TeamNavigationComponent teamId={team.id} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {children}
        </div>
      </main>
    </TeamProvider>
  );
}
