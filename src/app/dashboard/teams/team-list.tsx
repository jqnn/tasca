"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import CreateTeamDialog from "~/app/dashboard/teams/(dialogs)/create-project";
import { TeamCardComponent } from "~/components/cards/team-card";

export function TeamList() {
  const [showCreating, setShowCreating] = React.useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: role, status: roleStatus } = api.user.getRole.useQuery({
    id: Number(session.user.id),
  });
  const { data: teams, status } = api.team.findAll.useQuery({
    id: session.user.id,
  });

  if (status !== "success" || roleStatus !== "success") {
    return <Spinner />;
  }

  return (
    <div>
      {role !== "USER" && (
        <div className="flex items-center pb-4">
          <Button
            variant="outline"
            className="mr-auto"
            onClick={() => setShowCreating(true)}
          >
            Erstellen
          </Button>
        </div>
      )}

      {teams && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((members) => (
            <TeamCardComponent key={members.team.id} team={members.team} />
          ))}
        </div>
      )}

      {role !== "USER" && showCreating && (
        <CreateTeamDialog
          open={showCreating}
          setOpen={setShowCreating}
          onCreate={(team) => {
            router.push(`/dashboard/teams/${team.id}`);
          }}
        />
      )}
    </div>
  );
}
