"use client";

import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  SiteHeader,
  SiteTitle,
  SiteDescription, SiteHeaderSkeleton,
} from "~/components/ui/site-header";
import Spinner from "~/components/ui/spinner";

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
    return <p>Kein Projekt gefunden.</p>;
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Vorlage - " + project.name} />
        {project.description && (
          <SiteDescription description={project.description} />
        )}
      </SiteHeader>
    </>
  );
}
