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
import { useTranslations } from "next-intl";

interface PageProps {
  params: Promise<{
    pid: string;
  }>;
}

export default function TaskPage({ params }: PageProps) {
  const t = useTranslations();
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
      showToast(t("common.error"), t("team.project.mark-as-done.not-done"));
      return;
    }

    showToast(
      t("team.mark-as-done.project.loading.title"),
      t("team.mark-as-done.project.loading.message"),
    );
    updateMutation.mutate(
      { id: project.id, value: "COMPLETED" },
      {
        onSuccess: () => {
          showToast(
            t("team.mark-as-done.project.success.title"),
            t("team.mark-as-done.project.success.message"),
          );
          router.push(`/dashboard/teams/${project.teamId}/projects`);
        },
        onError: () => {
          showErrorToast(t);
        },
      },
    );
  };

  return (
    <div className={"w-full"}>
      <ChildrenHeader>
        <SiteTitle title={`${t("team.")} - ${project.name}`} />
        {project.description && (
          <SiteDescription description={project.description} />
        )}
      </ChildrenHeader>

      <ProjectTasksTable project={project} tasks={project.ProjectTask} />

      {project.status == "OPEN" && (
        <div className={"mt-4"}>
          <Button variant={"default"} onClick={handleDone}>
            {t("team.common.mark-as-done")}
          </Button>
        </div>
      )}
    </div>
  );
}
