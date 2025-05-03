import type { FormEvent } from "react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DialogInput from "~/components/dialogs/dialog-input";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import type { Team } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function CreateTeamDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (team: Team) => void | null;
}) {
  const t = useTranslations();

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        name: name,
        description: description,
        userId: session?.user?.id ?? "0",
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

  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string | null>(null);

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const createMutation = api.team.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Erstelle ein neues Team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <DialogInput
              id={"name"}
              label={"Teamname"}
              setValue={setName}
              required={true}
            />

            <DialogInput
              id={"description"}
              label={"Beschreibung"}
              setValue={setDescription}
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
