"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import TeamMembersTable from "~/app/dashboard/teams/[id]/(owner)/members/members-table";
import TeamInvitesTable from "~/app/dashboard/teams/[id]/(owner)/members/invites-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ChildrenHeader, SiteTitle } from "~/components/ui/site-header";

export default function TeamMembersPage() {
  const team = useTeam();
  const [tab, setTab] = React.useState<string>("members");
  if (!team) {
    return notFound();
  }

  if (team.userRole != "OWNER") {
    return notFound();
  }

  return (
    <>
      <ChildrenHeader>
        <SiteTitle title={tab == "members" ? "Mitglieder" : "Einladungen"} />
      </ChildrenHeader>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="members" onClick={() => setTab("members")}>
            Mitglieder
          </TabsTrigger>
          <TabsTrigger value="invites" onClick={() => setTab("invites")}>
            Einladungen
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <TeamMembersTable />
        </TabsContent>
        <TabsContent value="invites">
          <TeamInvitesTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
