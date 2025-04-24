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
import { type AuthMethod, Role, type User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { beautifyRole, showErrorToast, showToast } from "~/lib/utils";
import DialogInput from "~/components/dialogs/dialog-input";

export default function CreateUserDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (user: User) => void | null;
}) {
  const handleConfirm = () => {
    if (authMethod == null) {
      showErrorToast();
      return;
    }

    existsMutation.mutate(
      { userName: userName },
      {
        onSuccess: (exists) => {
          if (exists) {
            showToast(
              "Fehler",
              "Ein Benutzer mit diesem Benutzernamen existiert bereits.",
            );
            return;
          }

          createMutation.mutate(
            {
              userName: userName,
              password: password,
              displayName: displayName,
              role: role,
              authMethod: authMethod.id,
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
        },
      },
    );
  };

  const [userName, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState<string>("");
  const [role, setRole] = React.useState<Role>("USER");
  const [authMethod, setAuthMethod] = React.useState<AuthMethod | null>(null);

  const existsMutation = api.user.exists.useMutation();
  const createMutation = api.user.create.useMutation();

  const { data } = api.authMethod.findAll.useQuery();
  if (!data) return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Erstelle einen neuen Benutzer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
        <div className="grid w-full gap-4 py-4">
          <DialogInput
            id={"userName"}
            label={"Benutzername"}
            required={true}
            setValue={setUserName}
          />

          <DialogInput
            id={"displayName"}
            label={"Anzeigename"}
            required={true}
            setValue={setDisplayName}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rolle
            </Label>
            <div className={"col-span-3"}>
              <Select
                required={true}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle eine Rolle" />
                </SelectTrigger>
                <SelectContent id={"role"}>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {beautifyRole(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Methode
            </Label>
            <div className={"col-span-3"}>
              <Select
                required={true}
                onValueChange={(value) => {
                  const method = data.find((e) => e.id === Number(value));
                  if (!method) {
                    setAuthMethod(null);
                    return;
                  }
                  setAuthMethod(method);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle eine Methode" />
                </SelectTrigger>
                <SelectContent id={"method"}>
                  {data.map((method) => (
                    <SelectItem key={method.id} value={method.id.toString()}>
                      {method.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {authMethod && authMethod.type == "LOCAL" && (
            <DialogInput
              id={"password"}
              label={"Passwort"}
              required={true}
              setValue={setPassword}
              type={"password"}
            />
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={existsMutation.isPending || createMutation.isPending}>
            Erstellen
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
