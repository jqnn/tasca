"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import * as React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

export function TaskList() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const [showComplete, setShowComplete] = React.useState(false);
  const { data: tasks, status } = api.instance.findAll.useQuery({
    completed: showComplete,
  });

  return (
    <div>
      <div className="flex items-center pb-4">
        <Button variant="outline" className="mr-auto">
          Erstellen
        </Button>

        <div className="flex items-center space-x-2">
          <Switch checked={showComplete} onCheckedChange={setShowComplete} id="completed" />
          <Label htmlFor="completed">Fertige anzeigen</Label>
        </div>
      </div>

      {status !== "success" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 max-w-1/3" />
                <Skeleton className="mt-1.5 h-4 max-w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.template.name}</CardTitle>
                  <CardDescription>{task.status}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
