import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { type TemplateTask } from "@prisma/client";
import { api } from "~/trpc/react";
import { showToast } from "~/lib/utils";

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
  const handleConfirm = () => {
    createTemplateTask.mutate(
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
          showToast(
            "Unerwarteter Fehler",
            "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
          );
        },
      },
    );
  };

  const [task, setTask] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const createTemplateTask = api.templateTask.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Füge eine neue Aufgabe hinzu.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Aufgabe
            </Label>
            <Input
              id="name"
              className="col-span-3"
              placeholder="Aufgabe"
              required={true}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Beschreibung
            </Label>
            <Input
              id="description"
              className="col-span-3"
              placeholder="Gib eine Beschreibung ein"
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            type="submit"
            disabled={createTemplateTask.isPending}
          >
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
