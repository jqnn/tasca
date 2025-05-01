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
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function CreateTemplateDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (template: Template) => void | null;
}) {
  const t = useTranslations();

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    createMutation.mutate(
      {
        teamId: team.team.id,
        name: name,
        description: description,
        userId: session?.user?.id ?? "0",
        signature: signature,
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
          showErrorToast(t);
        },
      },
    );
  };

  const team = useTeam();
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string | null>(null);
  const [signature, setSignature] = React.useState<boolean>(false);
  const { data: session } = useSession();
  if (session == null) return;

  const createMutation = api.template.create.useMutation();

  if (!team) {
    return notFound();
  }

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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Unterschrift
              </Label>
              <div className={"col-span-3"}>
                <Select
                  required={true}
                  onValueChange={(value) => setSignature(value == "true")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wird eine Unterschrift benötigt?" />
                  </SelectTrigger>
                  <SelectContent id={"role"}>
                    <SelectItem value={"true"}>Ja</SelectItem>
                    <SelectItem value={"false"}>Nein</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
