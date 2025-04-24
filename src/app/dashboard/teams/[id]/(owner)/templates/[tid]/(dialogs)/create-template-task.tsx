import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { type TemplateTask } from "@prisma/client";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import DialogInput from "~/components/dialogs/dialog-input";
import type { FormEvent } from "react";

export default function CreateTemplateTaskDialog({
  templateId,
  order,
  open,
  setOpen,
  onCreate,
}: {
  templateId: number;
  order: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (template: TemplateTask) => void | null;
}) {
  const handleConfirm = (e: FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      {
        task: task,
        description: description,
        templateId: templateId,
        order: order,
      },
      {
        onSuccess: (data) => {
          if (!onCreate) {
            window.location.reload();
            return;
          }

          onCreate(data);
          setOpen(false);
          setTask("");
          setDescription("");
        },
        onError: () => {
          showErrorToast();
        },
      },
    );
  };

  const [task, setTask] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const createMutation = api.templateTask.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Füge eine neue Aufgabe hinzu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <DialogInput
              id={"task"}
              label={"Aufgabe"}
              required={true}
              setValue={setTask}
            />

            <DialogInput
              id={"description"}
              label={"Beschreibung"}
              required={true}
              setValue={setDescription}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
