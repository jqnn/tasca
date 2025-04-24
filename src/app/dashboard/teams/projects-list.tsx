"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import CreateTeamDialog from "~/app/dashboard/teams/(dialogs)/create-project";

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
          {teams.map((members) => {
            const team = members.team
            const title = team.personal
              ? (team.createdBy.displayName ?? team.createdBy.userName)
              : team.name;

            const description = team.personal ? (
              <>
                <p>persönliches Projekt</p>
                <p>Aufgaben - 0</p>
              </>
            ) : (
              <>
                {team.description ? (
                  <p>Beschreibung - {team.description}</p>
                ): (
                  <p>Mitglieder - {team.TeamMember.length}</p>
                  )}
                <p>
                  Besitzer -&nbsp;
                  {team.createdBy.displayName ?? team.createdBy.userName}
                </p>
              </>
            );

            return (
              <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {role !== "USER" && showCreating && (
        <CreateTeamDialog
          open={showCreating}
          setOpen={setShowCreating}
          onCreate={(project) => {
            router.push(`/dashboard/projects/${project.id}`);
          }}
        />
      )}
    </div>
  );
}
