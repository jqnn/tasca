"use client";

import React from "react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import TeamMembersTable from "~/app/dashboard/teams/[id]/(owner)/members/members-table";
import TeamInvitesTable from "~/app/dashboard/teams/[id]/(owner)/members/invites-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ChildrenHeader, SiteTitle } from "~/components/ui/site-header";
import { useTranslations } from "next-intl";

export default function TeamMembersPage() {
  const t = useTranslations();
  const team = useTeam();
  const [tab, setTab] = React.useState<string>("members");
  if (!team) {
    return notFound();
  }

  if (team.userRole != "OWNER") {
    return notFound();
  }

  const members = t("team.navigation.members");
  const invites = t("common.sidebar.invites");

  return (
    <>
      <ChildrenHeader>
        <SiteTitle title={tab == "members" ? members : invites} />
      </ChildrenHeader>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="members" onClick={() => setTab("members")}>
            {members}
          </TabsTrigger>
          <TabsTrigger value="invites" onClick={() => setTab("invites")}>
            {invites}
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
