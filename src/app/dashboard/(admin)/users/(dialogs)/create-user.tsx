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
import {type AuthMethod, Role, type User} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { showToast } from "~/lib/utils";

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
      showToast(
        "Unerwarteter Fehler",
        "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
      );
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

          createAuthMethod.mutate(
            {
              userName: userName,
              password: password,
              displayName: displayName,
              role: role,
              authMethod: authMethod.id,
            },
            {
              onSuccess: (data) => {
                if (!onCreate) {
                  window.location.reload();
                  return;
                }

                onCreate(data);
                setOpen(false)
              },
              onError: () => {
                showToast(
                  "Unerwarteter Fehler",
                  "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
                );
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
  const createAuthMethod = api.user.create.useMutation();

  const { data } = api.authMethod.findAll.useQuery();
  if (!data) return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>Erstelle einen neuen Benutzer.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">
              Benutzername
            </Label>
            <Input
              id="userName"
              className="col-span-3"
              placeholder="Gib einen Benutzernamen ein"
              required={true}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="displayName" className="text-right">
              Anzeigename
            </Label>
            <Input
              id="displayName"
              className="col-span-3"
              placeholder="Gib einen Anzeigenamen ein"
              required={true}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

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
                      {role}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Passwort
              </Label>
              <Input
                id="password"
                type={"password"}
                className="col-span-3"
                placeholder="Gib ein Passwort ein"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} type="submit">
            Erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
