import * as React from "react";
import { type InstanceTemplate, type Template } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { showErrorToast } from "~/lib/utils";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useTeam } from "~/context/TeamProvider";
import Spinner from "~/components/ui/spinner";

export default function CreateTaskByTemplateDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (template: InstanceTemplate) => void | null;
}) {
  const handleConfirm = (e: FormEvent) => {
    e.preventDefault()
    if (template == null) {
      showErrorToast();
      return;
    }

    createMutation.mutate(
      {
        teamId: team.team.id,
        templateId: template.id,
        userId: session?.user?.id ?? "0",
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
  const [template, setTemplate] = React.useState<Template | null>(null);

  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const createMutation = api.instance.create.useMutation();
  const { data, status } = api.template.findAll.useQuery({
    teamId: team.team.id
  });

  if(status !== "success") {
    return <Spinner />
  }

  if(!(data)) {
    return notFound();
  }

  if(!(team)) {
    return notFound();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine Aufgabe mit Vorlage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                Vorlage
              </Label>
              <div className={"col-span-3"}>
                <Select
                  required={true}
                  onValueChange={(value) => {
                    const template = data.find((e) => e.id === Number(value));
                    if (!template) {
                      setTemplate(null);
                      return;
                    }
                    setTemplate(template);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wähle eine Vorlage" />
                  </SelectTrigger>
                  <SelectContent id={"template"}>
                    {data.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.name}
                      </SelectItem>
                    ))}
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
