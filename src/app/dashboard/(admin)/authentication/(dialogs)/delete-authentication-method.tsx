import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { useState } from "react";

export function DeleteAuthenticationMethodDialog({
  open,
  setOpen,
  authMethodId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  authMethodId: number | null;
}) {
  const handleConfirm = () => {
    if (authMethodId === null) {
      setOpen(false);
      return;
    }

    deleteAuthMethod.mutate(
      { id: authMethodId },
      {
        onSuccess: () => {
          window.location.reload();
          setOpen(false);
        },
        onError: (error) => {
          setError(
            "Es ist ein unerwarteter Fehler aufgetreten. Möglicherweise hat diese Authentifiezerungsmethode noch Benutzer.",
          );
          console.log(error);
        },
      },
    );
  };

  const deleteAuthMethod = api.authMethod.delete.useMutation();
  const [error, setError] = useState<string | null>(null);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du Dir sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogDescription className={"text-red-500"}>
          {error}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
