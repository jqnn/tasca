"use client";

import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  SiteHeader,
  SiteTitle,
  SiteDescription,
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

  const { data: role, isLoading } = api.user.getRole.useQuery({
    id: Number(session.user?.id),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (role !== "ADMINISTRATOR") {
    redirect("/dashboard");
  }

  const { data: project, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.id)),
  });

  if (status !== "success") {
    return <Spinner />;
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
