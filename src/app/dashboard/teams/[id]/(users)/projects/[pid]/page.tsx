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

  const { data: project, status } = api.teamProjects.find.useQuery({
    id: Number(actualParams.pid),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!project) {
    return notFound();
  }

  return (
    <div className={"w-full"}>
      <ChildrenHeader>
        <SiteTitle title={"Project - " + project.name} />
        {project.description && (
          <SiteDescription description={project.description} />
        )}
      </ChildrenHeader>

      <ProjectTasksTable project={project} tasks={project.ProjectTask} />
    </div>
  );
}
