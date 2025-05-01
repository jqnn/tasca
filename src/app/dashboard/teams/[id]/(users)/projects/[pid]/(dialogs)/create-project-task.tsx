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
import { notFound } from "next/navigation";
import { useTeam } from "~/context/TeamProvider";
import DialogInput from "~/components/dialogs/dialog-input";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    createMutation.mutate(
      {
        projectId: projectId,
        task: name,
        description: description,
      },
      {
        onSuccess: (data) => {
          if (!data) {
            showErrorToast(t);
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
          showErrorToast(t);
        },
      },
    );
  };

  const team = useTeam();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

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
