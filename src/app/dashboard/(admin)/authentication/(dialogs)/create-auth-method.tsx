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
import type { FormEvent } from "react";
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
import DialogInput from "~/components/dialogs/dialog-input";
import SecurityType = $Enums.SecurityType;
import { useTranslations } from "next-intl";

export default function CreateAuthenticationMethodDialog({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (authMethod: AuthMethod) => void | null;
}) {
  const t = useTranslations()

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    existsMutation.mutate(
      { description: description },
      {
        onSuccess: (data) => {
          if (data) return;

          createMutation.mutate(
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
                showErrorToast(t);
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
  const createMutation = api.authMethod.create.useMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Authentifizierungsmethode.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm}>
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

            <DialogInput
              id={"description"}
              label={"Beschreibung"}
              required={true}
              setValue={setDescription}
            />

            <div />

            <DialogInput
              id={"controller"}
              label={"Controller"}
              required={true}
              setValue={setController}
            />

            <DialogInput
              id={"baseDN"}
              label={"Basis-DN"}
              placeHolder={"CN=Users,CN=Firma,DC=domain,DC=local"}
              required={true}
              setValue={setBaseDN}
            />

            {type == AuthMethodType.AD && (
              <DialogInput
                id={"suffix"}
                label={"Suffix"}
                placeHolder={"@domain.local"}
                required={true}
                setValue={setSuffix}
              />
            )}

            {type == AuthMethodType.LDAP && (
              <>
                <DialogInput
                  id={"userDN"}
                  label={"Benutzer-DN"}
                  required={true}
                  setValue={setUserDN}
                />
                <DialogInput
                  id={"uidAttribute"}
                  label={"UID-Attribut"}
                  placeHolder={"uid"}
                  required={true}
                  setValue={setUID}
                />
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

            <DialogInput
              id={"port"}
              label={"Port"}
              placeHolder={"389"}
              required={true}
              setValue={(value) => setPort(Number(value))}
              type={"number"}
              min={1}
              max={65535}
            />

            <div />

            <DialogInput
              id={"userName"}
              label={"Benutzername"}
              placeHolder={"Domänen-Benutzername"}
              required={true}
              setValue={setUserName}
            />

            <DialogInput
              id={"password"}
              label={"Passwort"}
              placeHolder={"Domänen-Passwort"}
              required={true}
              setValue={setPassword}
              type={"password"}
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
