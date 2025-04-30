import type { FormEvent } from "react";
import * as React from "react";
import { type Project } from "@prisma/client";
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
import { useTranslations } from "next-intl";

export default function CreateProjectDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (project: Project) => void | null;
}) {
  const t = useTranslations()

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    createMutation.mutate(
      {
        teamId: team.team.id,
        userId: session?.user?.id ?? "0",
        name: name,
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
  const router = useRouter();
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string | undefined>(
    undefined,
  );

  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const createMutation = api.teamProjects.create.useMutation();
  if (!team) {
    return notFound();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Erstelle ein neues Projekt.</DialogDescription>
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
              required={false}
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
