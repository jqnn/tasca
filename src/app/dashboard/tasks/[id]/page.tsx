"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import { api } from "~/trpc/react";
import { TaskFields } from "~/app/dashboard/tasks/[id]/fields";
import TasksTable from "~/app/dashboard/tasks/[id]/tasks";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { isTaskDone, showErrorToast, showToast } from "~/lib/utils";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TaskPage({ params }: PageProps) {
  const router = useRouter();
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const updateMutation = api.instance.updateInstanceState.useMutation();
  const { data: instance, status } = api.instance.find.useQuery({
    id: Number(actualParams.id),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!instance) {
    return <p>Keine Aufgabe gefunden.</p>;
  }

  const handleDone = () => {
    if (!isTaskDone(instance)) {
      showToast(
        "Fehler",
        "Die Aufgabe muss erst beendet werden, bevor sie als Fertig markiert werden kann.",
      );
      return;
    }

    showToast("Lädt...", "Die Aufgabe wird aktualisert...");
    updateMutation.mutate(
      { id: instance.id, value: "COMPLETED" },
      {
        onSuccess: () => {
          showToast(
            "Erfolgreich",
            "Die Aufgabe wurde erfolgreich aktualisiert.",
          );
          router.push("/dashboard/tasks");
        },
        onError: () => {
          showErrorToast();
        },
      },
    );
  };

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Aufgabe - " + instance.template.name} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <TaskFields
            instances={instance.InstanceField}
            disabled={instance.status == "COMPLETED"}
          />
          <TasksTable
            instances={instance.InstanceTask}
            disabled={instance.status == "COMPLETED"}
          />

          {instance.status == "OPEN" && (
            <div className={"mt-4"}>
              <Button variant={"default"} onClick={handleDone}>
                Als Fertig markieren
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
