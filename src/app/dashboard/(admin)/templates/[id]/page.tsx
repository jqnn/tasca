"use client";

import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { SiteHeader } from "~/components/ui/site-header";

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

  const [role] = api.user.getRole.useSuspenseQuery({
    id: Number(session.user?.id),
  });

  if (role !== "ADMINISTRATOR") {
    redirect("/dashboard");
  }

  const { data: project, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.id)),
  });

  if (status !== "success") {
    return <p>Lädt...</p>;
  }

  if (!project) {
    return <p>Kein Projekt gefunden.</p>;
  }

  return (
    <>
      <SiteHeader title={"Projekt - " + project.name} />
    </>
  );
}
