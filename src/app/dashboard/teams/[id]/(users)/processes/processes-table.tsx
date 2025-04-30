"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import CreateTaskByTemplateDialog from "~/app/dashboard/teams/[id]/(users)/processes/(dialogs)/create-task";
import Spinner from "~/components/ui/spinner";
import { TaskCardComponent } from "~/components/cards/task-card";
import { useTeam } from "~/context/TeamProvider";
import { useTranslations } from "next-intl";

export function TeamProcessesTable() {
  const t = useTranslations()
  const team = useTeam();
  const [showModal, setShowModal] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: tasks, status } = api.instance.findAll.useQuery({
    teamId: team.team.id,
    completed: showComplete,
  });

  if (status !== "success") {
    return <Spinner />;
  }

  return (
    <div className={"w-full"}>
      <div className="flex items-center pb-4">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setShowModal(true)}
        >
          {t("common.create")}
        </Button>

        <div className="flex items-center space-x-2">
          <Switch
            checked={showComplete}
            onCheckedChange={setShowComplete}
            id="completed"
          />
          <Label htmlFor="completed">{t("common.show-finished")}</Label>
        </div>
      </div>

      {tasks && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCardComponent key={task.id} task={task} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTaskByTemplateDialog
          open={showModal}
          setOpen={setShowModal}
          onCreate={(instance) => {
            router.push(
              `/dashboard/teams/${team.team.id}/processes/${instance.id}`,
            );
          }}
        />
      )}
    </div>
  );
}
