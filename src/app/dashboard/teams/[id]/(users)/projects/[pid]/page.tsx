"use client";

import { notFound, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import {
  ChildrenHeader,
  SiteDescription,
  SiteTitle,
} from "~/components/ui/site-header";
import ProjectTasksTable from "~/app/dashboard/teams/[id]/(users)/projects/[pid]/project-tasks";
import { Button } from "~/components/ui/button";
import { isProjectDone, showErrorToast, showToast } from "~/lib/utils";

interface PageProps {
  params: Promise<{
    pid: string;
  }>;
}

export default function TaskPage({ params }: PageProps) {
  const team = useTeam();
  const router = useRouter();
  const actualParams = React.use(params);

  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  if (!team) {
    return notFound();
  }

  const updateMutation = api.teamProjects.updateProjectState.useMutation();
  const { data: project, status } = api.teamProjects.find.useQuery({
    id: Number(actualParams.pid),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!project) {
    return notFound();
  }

  const handleDone = () => {
    if (!isProjectDone(project.ProjectTask)) {
      showToast(
        "Fehler",
        "Das Projekt muss erst beendet werden, bevor es als Fertig markiert werden kann.",
      );
      return;
    }

    showToast("Lädt...", "Das Projekt wird aktualisert...");
    updateMutation.mutate(
      { id: project.id, value: "COMPLETED" },
      {
        onSuccess: () => {
          showToast(
            "Erfolgreich",
            "Das Projekt wurde erfolgreich aktualisiert.",
          );
          router.push(`/dashboard/teams/${project.teamId}/projects`);
        },
        onError: () => {
          showErrorToast();
        },
      },
    );
  };

  return (
    <div className={"w-full"}>
      <ChildrenHeader>
        <SiteTitle title={"Project - " + project.name} />
        {project.description && (
          <SiteDescription description={project.description} />
        )}
      </ChildrenHeader>

      <ProjectTasksTable project={project} tasks={project.ProjectTask} />

      {project.status == "OPEN" && (
        <div className={"mt-4"}>
          <Button variant={"default"} onClick={handleDone}>
            Als Fertig markieren
          </Button>
        </div>
      )}
    </div>
  );
}
