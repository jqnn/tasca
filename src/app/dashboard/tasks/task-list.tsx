"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import CreateTaskByTemplateDialog from "~/app/dashboard/tasks/(dialogs)/create-task";
import { beautifyInstanceStatus } from "~/lib/utils";
import Spinner from "~/components/ui/spinner";

export function TaskList() {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const [showCreated, setShowCreated] = React.useState(false);
  const [showComplete, setShowComplete] = React.useState(false);
  const { data: tasks, status } = api.instance.findAll.useQuery({
    completed: showComplete,
  });

  if (status !== "success") {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setShowCreated(true)}
        >
          Erstellen
        </Button>

        <div className="flex items-center space-x-2">
          <Switch
            checked={showComplete}
            onCheckedChange={setShowComplete}
            id="completed"
          />
          <Label htmlFor="completed">Fertige anzeigen</Label>
        </div>
      </div>

      {tasks && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const field = task.InstanceField.sort(
              (a, b) => a.field.order - b.field.order,
            );

            const firstField = field[0];

            return (
              <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle>
                      {firstField
                        ? firstField.field.label + " - " + firstField.value
                        : task.template.name}
                    </CardTitle>
                    <CardDescription>
                      <p>
                        Ersteller -{" "}
                        {task.createdBy.displayName ?? task.createdBy.userName}
                      </p>
                      <p>Status - {beautifyInstanceStatus(task.status)}</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {showCreated && (
        <CreateTaskByTemplateDialog
          open={showCreated}
          setOpen={setShowCreated}
          onCreate={(instance) => {
            router.push(`/dashboard/tasks/${instance.id}`);
          }}
        />
      )}
    </div>
  );
}
