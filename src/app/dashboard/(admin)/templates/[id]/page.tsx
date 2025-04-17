"use client";

import {notFound, redirect} from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  SiteHeader,
  SiteTitle,
  SiteDescription, SiteHeaderSkeleton,
} from "~/components/ui/site-header";
import TemplateTaskTable from "~/app/dashboard/(admin)/templates/[id]/table";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TemplatePage({ params }: PageProps) {
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const { data: project, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.id)),
  });

  if (status !== "success") {
    return (
        <SiteHeaderSkeleton />
    )
  }

  if (!project) {
    notFound();
  }

  const tasks = project.TemplateTask ?? [];

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Vorlage - " + project.name} />
        {project.description && (
          <SiteDescription description={project.description} />
        )}
      </SiteHeader>
      <TemplateTaskTable tasks={tasks} />
    </>
  );
}
