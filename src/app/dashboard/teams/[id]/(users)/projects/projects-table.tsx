"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import { ProjectCardComponent } from "~/components/cards/project-card";
import CreateProjectDialog from "~/app/dashboard/teams/[id]/(users)/projects/(dialogs)/create-project";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { useTranslations } from "next-intl";
import { Input } from "~/components/ui/input";

export function TeamProjectsTable() {
  const t = useTranslations();
  const team = useTeam();
  const [showModal, setShowModal] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);
  const [filter, setFilter] = React.useState("");

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: projects, status } = api.teamProjects.findAll.useQuery({
    teamId: team.team.id,
    completed: showComplete,
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
          {t("common.create")}
        </Button>

        <div className="flex items-center p-4">
          <Input
            className="max-w-md"
            placeholder={t("team.filter.project")}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={showComplete}
            onCheckedChange={setShowComplete}
            id="completed"
          />
          <Label htmlFor="completed">{t("common.show-finished")}</Label>
        </div>
      </div>

      {projects && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((project) =>
              project.name.toLowerCase().includes(filter.toLowerCase()),
            )
            .map((project) => (
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
