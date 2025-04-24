"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import {
  SiteDescription,
  SiteHeader,
  SiteTitle,
} from "~/components/ui/site-header";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({ params }: PageProps) {
  const router = useRouter();
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: project, status } = api.project.find.useQuery({
    id: Number(actualParams.id),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!project) {
    return <p>Kein Projekt gefunden.</p>;
  }

  const title = project.personal
    ? (project.createdBy.displayName ?? project.createdBy.userName)
    : project.name;

  const description = project.personal
    ? "persönliches Projekt"
    : project.description;

  return (
    <>
      <SiteHeader>
        <SiteTitle title={`Team - ${title}`} />
        {description && (
          <SiteDescription description={description} />
        )}
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <p>TODO</p>
        </div>
      </main>
    </>
  );
}
