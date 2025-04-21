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
import { useRouter } from "next/navigation";

export default function CreateTaskByTemplateDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (template: InstanceTemplate) => void | null;
}) {
  const handleConfirm = () => {
    if (template == null) {
      showErrorToast();
      return;
    }

    createMutation.mutate(
      {
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

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const [template, setTemplate] = React.useState<Template | null>(null);
  const createMutation = api.instance.create.useMutation();

  const { data } = api.template.findAll.useQuery();
  if (!data) return;

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
