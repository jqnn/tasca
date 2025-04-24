"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { isTaskDone, showErrorToast, showToast } from "~/lib/utils";
import ProcessTasksTable from "~/app/dashboard/teams/[id]/(users)/processes/[pid]/process-tasks";
import ProcessFieldsContainer from "~/app/dashboard/teams/[id]/(users)/processes/[pid]/process-fields";

interface PageProps {
  params: Promise<{
    pid: string;
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
    id: Number(actualParams.pid),
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
      <h1 className={"mr-auto mb-4 font-bold"}>
        Prozess - {instance.template.name}
      </h1>

      <ProcessFieldsContainer
        instances={instance.InstanceField}
        disabled={instance.status == "COMPLETED"}
      />
      <ProcessTasksTable
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
    </>
  );
}
