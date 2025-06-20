"use client";

import { notFound, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { isTaskDone, showErrorToast, showToast } from "~/lib/utils";
import ProcessTasksTable from "~/app/dashboard/teams/[id]/(users)/processes/[pid]/process-tasks";
import ProcessFieldsContainer from "~/app/dashboard/teams/[id]/(users)/processes/[pid]/process-fields";
import { useTeam } from "~/context/TeamProvider";
import { useTranslations } from "next-intl";
import SignaturePad from "~/components/instance/signature-pad";

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

  const updateMutation = api.instance.updateInstanceState.useMutation();
  const updateSignatureMutation = api.instance.updateSignature.useMutation({
    onMutate: () =>
      showToast(t("signature.updating.title"), t("signature.updating.message")),
    onSuccess: () =>
      showToast(t("signature.updated.title"), t("signature.updated.message")),
    onError: () => showErrorToast(t),
  });
  const { data: instance, status } = api.instance.find.useQuery({
    id: Number(actualParams.pid),
  });

  if (status !== "success") {
    return <Spinner />;
  }

  if (!instance) {
    return notFound();
  }

  const handleDone = () => {
    if (!isTaskDone(instance)) {
      showToast(t("common.error"), t("team.process.mark-as-done.not-done"));
      return;
    }

    showToast(
      t("team.mark-as-done.process.loading.title"),
      t("team.mark-as-done.process.loading.message"),
    );
    updateMutation.mutate(
      { id: instance.id, value: "COMPLETED" },
      {
        onSuccess: () => {
          showToast(
            t("team.mark-as-done.process.success.title"),
            t("team.mark-as-done.process.success.message"),
          );
          router.push(`/dashboard/teams/${instance.teamId}/processes`);
        },
        onError: () => {
          showErrorToast(t);
        },
      },
    );
  };

  return (
    <>
      <h1 className={"mr-auto mb-4 font-bold"}>
        {t("team.common.process")} - {instance.template.name}
      </h1>

      <ProcessFieldsContainer
        instances={instance.InstanceField}
        disabled={instance.status == "COMPLETED"}
      />
      <ProcessTasksTable
        instances={instance.InstanceTask}
        disabled={instance.status == "COMPLETED"}
      />

      {instance.template.needsSignature && (
        <SignaturePad
          t={t}
          defaultValue={
            instance.Signature ? instance.Signature.signature : null
          }
          action={(value) => {
            if (instance.Signature == null) return;
            if (!value) return;

            updateSignatureMutation.mutate({
              id: instance.Signature.id,
              value: value,
            });
          }}
          disabled={instance.status == "COMPLETED"}
        />
      )}

      {instance.status == "OPEN" && (
        <div className={"mt-4"}>
          <Button variant={"default"} onClick={handleDone}>
            {t("team.common.mark-as-done")}
          </Button>
        </div>
      )}
    </>
  );
}
