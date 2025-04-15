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
import { showToast } from "~/lib/utils";

export function DeleteAuthenticationMethodDialog({
  open,
  setOpen,
  authMethodId,
  onDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  authMethodId: number | null;
  onDelete?: () => void | null;
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
          if (!onDelete) {
            window.location.reload();
            return;
          }

          onDelete();
        },
        onError: () => {
          showToast(
            "Unerwarteter Fehler",
            "Möglicherweise hat diese Authentifiezerungsmethode noch Benutzer.",
          );
        },
      },
    );
  };

  const deleteAuthMethod = api.authMethod.delete.useMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du Dir sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
