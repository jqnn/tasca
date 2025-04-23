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
import CreateProjectDialog from "~/app/dashboard/projects/(dialogs)/create-project";

export function ProjectList() {
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
  const { data: projects, status } = api.project.findAll.useQuery();

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

      {projects && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const title = project.personal
              ? (project.createdBy.displayName ?? project.createdBy.userName)
              : project.name;

            const description = project.personal ? (
              <>
                <p>persönliches Projekt</p>
                <p>Aufgaben - 0</p>
              </>
            ) : (
              <>
                {project.description && (
                  <p>Beschreibung - {project.description}</p>
                )}
                <p>
                  Ersteller -{" "}
                  {project.createdBy.displayName ?? project.createdBy.userName}
                </p>
              </>
            );

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
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
        <CreateProjectDialog
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
