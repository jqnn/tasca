import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type { FormEvent } from "react";
import * as React from "react";
import { type Template } from "@prisma/client";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import { useSession } from "next-auth/react";
import DialogInput from "~/components/dialogs/dialog-input";

export default function CreateTemplateDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (template: Template) => void | null;
}) {
  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    existsMutation.mutate(
      { name: name },
      {
        onSuccess: (data) => {
          if (data) return;

          createMutation.mutate(
            {
              name: name,
              description: description,
              userId: session?.user?.id ?? "0",
            },
            {
              onSuccess: (data) => {
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
        },
      },
    );
  };

  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string | null>(null);
  const { data: session } = useSession();
  if (session == null) return;

  const existsMutation = api.template.exists.useMutation();
  const createMutation = api.template.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Erstelle eine neue Vorlage.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <DialogInput
              id={"name"}
              label={"Name"}
              required={true}
              setValue={setName}
            />

            <DialogInput
              id={"description"}
              label={"Beschreibung"}
              setValue={setDescription}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={existsMutation.isPending || createMutation.isPending}
            >
              Erstellen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
