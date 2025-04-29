"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import CreateTaskByTemplateDialog from "~/app/dashboard/teams/[id]/(users)/processes/(dialogs)/create-task";
import Spinner from "~/components/ui/spinner";
import { TaskCardComponent } from "~/components/cards/task-card";
import { useTeam } from "~/context/TeamProvider";
import { ProjectCardComponent } from "~/components/cards/project-card";
import CreateProjectDialog from "~/app/dashboard/teams/[id]/(users)/projects/(dialogs)/create-project";

export function TeamProjectsTable() {
  const team = useTeam();
  const [showModal, setShowModal] = React.useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: projects, status } = api.teamProjects.findAll.useQuery({
    id: team.team.id,
  });

  if (status !== "success") {
    return <Spinner />;
  }

  return (
    <div className={"w-full"}>
      <div className="flex items-center pb-4">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setShowModal(true)}
        >
          Erstellen
        </Button>
      </div>

      {projects && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCardComponent key={project.id} project={project} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateProjectDialog
          open={showModal}
          setOpen={setShowModal}
          onCreate={(project) => {
            router.push(
              `/dashboard/teams/${team.team.id}/projects/${project.id}`,
            );
          }}
        />
      )}
    </div>
  );
}
