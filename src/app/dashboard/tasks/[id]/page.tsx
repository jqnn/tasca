"use client";

import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import { api } from "~/trpc/react";
import { TaskFields } from "~/app/dashboard/tasks/[id]/fields";
import TasksTable from "~/app/dashboard/tasks/[id]/tasks";
import Spinner from "~/components/ui/spinner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TaskPage({ params }: PageProps) {
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const { data: instance, status } = api.instance.find.useQuery({
    id: Number(actualParams.id),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!instance) {
    return <p>Keine Aufgabe gefunden.</p>;
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Aufgabe - " + instance.template.name} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <TaskFields instances={instance.InstanceField} />
          <TasksTable instances={instance.InstanceTask} />
        </div>
      </main>
    </>
  );
}
