import type { FormEvent } from "react";
import * as React from "react";
import { type ProjectTask } from "@prisma/client";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { showErrorToast } from "~/lib/utils";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { useTeam } from "~/context/TeamProvider";
import DialogInput from "~/components/dialogs/dialog-input";

export default function CreateProjectTaskDialog({
  open,
  setOpen,
  onCreate,
  projectId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (projectTask: ProjectTask) => void | null;
  projectId: number;
}) {
  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    createMutation.mutate(
      {
        projectId: projectId,
        userId: session?.user?.id ?? "0",
        task: name,
        description: description,
      },
      {
        onSuccess: (data) => {
          if (!data) {
            showErrorToast();
            return;
          }

          if (!onCreate) {
            window.location.reload();
            return;
          }

          onCreate(data);
          setOpen(false);
        },

        onError: () => {
          showErrorToast();
        },
      },
    );
  };

  const team = useTeam();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const createMutation = api.teamProjects.createTask.useMutation();
  if (!team) {
    return notFound();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Aufgabe für dieses Projekt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <DialogInput
              id={"name"}
              label={"Name"}
              setValue={setName}
              required={true}
            />

            <DialogInput
              id={"descriptiion"}
              label={"Beschreibung"}
              setValue={setDescription}
              required={true}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              Erstellen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
