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
import { $Enums, type AuthMethod, AuthMethodType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { showErrorToast } from "~/lib/utils";
import SecurityType = $Enums.SecurityType;

export default function CreateAuthenticationMethodDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (authMethod: AuthMethod) => void | null;
}) {
  const handleConfirm = () => {
    existsMutation.mutate(
      { description: description },
      {
        onSuccess: (data) => {
          if (data) return;

          createAuthMethod.mutate(
            {
              description: description,
              type: type,
              controllers: controller,
              baseDN: baseDN,
              usersDN: userDN,
              uidAttribute: uid,
              accountSuffix: suffix,
              securityType: securityType,
              port: port,
              userName: userName,
              password: password,
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

  const [description, setDescription] = React.useState<string>("");
  const [type, setType] = React.useState<AuthMethodType>(AuthMethodType.LOCAL);
  const [controller, setController] = React.useState<string>("");
  const [baseDN, setBaseDN] = React.useState<string>("");
  const [userDN, setUserDN] = React.useState<string>("");
  const [uid, setUID] = React.useState<string>("");
  const [suffix, setSuffix] = React.useState<string>("");
  const [securityType, setSecurityType] = React.useState<SecurityType>(
    SecurityType.TLS,
  );
  const [port, setPort] = React.useState<number>(0);
  const [userName, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const existsMutation = api.authMethod.exists.useMutation();
  const createAuthMethod = api.authMethod.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Authentifizierungsmethode.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Typ
            </Label>
            <div className={"col-span-3"}>
              <Select
                required={true}
                onValueChange={(value) => setType(value as AuthMethodType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle einen Typ" />
                </SelectTrigger>
                <SelectContent id={"type"}>
                  {Object.values(AuthMethodType)
                    .filter((value) => value != "LOCAL")
                    .map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
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

          <div />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="controllers" className="text-right">
              Controller
            </Label>
            <Input
              id="controllers"
              placeholder={"domain.local"}
              className="col-span-3"
              required={true}
              onChange={(e) => setController(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="baseDN" className="text-right">
              Basis-DN
            </Label>
            <Input
              id="baseDN"
              placeholder={"CN=Users,CN=Firma,DC=domain,DC=local"}
              className="col-span-3"
              required={true}
              onChange={(e) => setBaseDN(e.target.value)}
            />
          </div>

          {type == AuthMethodType.AD && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suffix" className="text-right">
                Suffix
              </Label>
              <Input
                id="suffix"
                placeholder="@domain.local"
                className="col-span-3"
                required={true}
                onChange={(e) => setSuffix(e.target.value)}
              />
            </div>
          )}

          {type == AuthMethodType.LDAP && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userDN" className="text-right text-[0.842rem]">
                  Benutzer-DN
                </Label>
                <Input
                  id="userDN"
                  className="col-span-3"
                  placeholder="Nur, wenn nicht schon oben"
                  onChange={(e) => setUserDN(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="uidAttribute"
                  className="text-right text-[0.842rem]"
                >
                  UID-Attribut
                </Label>
                <Input
                  id="uidAttribute"
                  className="col-span-3"
                  placeholder={"uid"}
                  required={true}
                  onChange={(e) => setUID(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="securityType"
              className="text-right text-[0.842rem]"
            >
              Sicherheitstyp
            </Label>
            <div className={"col-span-3"}>
              <Select
                required={true}
                onValueChange={(value) =>
                  setSecurityType(value as SecurityType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle einen Sicherheitstyp" />
                </SelectTrigger>
                <SelectContent id={"securityType"}>
                  {Object.values(SecurityType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="port" className="text-right">
              Port
            </Label>
            <Input
              type={"number"}
              min={1}
              max={65535}
              id="port"
              className="col-span-3"
              placeholder="389"
              required={true}
              onChange={(e) => setPort(Number(e.target.value))}
            />
          </div>

          <div />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">
              Benutzername
            </Label>
            <Input
              id="userName"
              className="col-span-3"
              placeholder="Domänen-Benutzername"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Passwort
            </Label>
            <Input
              type={"password"}
              id="password"
              className="col-span-3"
              placeholder="Domänen-Passwort"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
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
