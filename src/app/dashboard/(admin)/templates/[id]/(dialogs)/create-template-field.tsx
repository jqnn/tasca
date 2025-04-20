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
import * as React from "react";
import { FieldType, type TemplateField } from "@prisma/client";
import { api } from "~/trpc/react";
import DialogInput from "~/components/dialogs/dialog-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { showErrorToast, showToast } from "~/lib/utils";

export default function CreateTemplateFieldDialog({
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
  onCreate?: (template: TemplateField) => void | null;
}) {
  const handleConfirm = () => {
    createMutation.mutate(
      {
        label: task,
        placeHolder: placeHolder,
        templateId: templateId,
        fieldType: fieldType,
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
        },
        onError: () => {
          showErrorToast()
        },
      },
    );
  };

  const [task, setTask] = React.useState<string>("");
  const [placeHolder, setPlaceHolder] = React.useState<string>("");
  const [fieldType, setFieldType] = React.useState<FieldType>("TEXT");
  const createMutation = api.templateField.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Füge ein neues Feld hinzu.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <DialogInput
            id={"label"}
            label={"Bezeichung"}
            required={true}
            setValue={setTask}
          />

          <DialogInput
            id={"placeHolder"}
            label={"Platzhalter"}
            required={false}
            setValue={setPlaceHolder}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Typ
            </Label>
            <div className={"col-span-3"}>
              <Select
                required={true}
                onValueChange={(value) => setFieldType(value as FieldType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle ein Feldtyp" />
                </SelectTrigger>
                <SelectContent id={"role"}>
                  {Object.values(FieldType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            type="submit"
            disabled={createMutation.isPending}
          >
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
