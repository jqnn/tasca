import type { UseTRPCMutationResult } from "@trpc/react-query/shared";
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
import { showToast } from "~/lib/utils";

export function DeleteDialog<K extends string>({
  open,
  setOpen,
  mutation,
  data,
  onDelete,
  loadingMessage,
  successMessage,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mutation: UseTRPCMutationResult<any, any, any, any>;
  data: Record<K, number | null>;
  onDelete?: () => void | null;
  loadingMessage?: string | null;
  successMessage?: string | null;
}) {
  const handleConfirm = () => {
    if (!data) {
      showToast(
        "Unerwarteter Fehler",
        "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
      );
      setOpen(false);
      return;
    }

    showToast("Lädt...", loadingMessage ?? "Das Element wird gelöscht...");
    mutation.mutate(data, {
      onSuccess: () => {
        if (!onDelete) {
          window.location.reload();
          return;
        }

        onDelete();
        setOpen(false);
        showToast(
          "Erfolgreich",
          successMessage ?? "Das Element wurde erfolgreich gelöscht.",
        );
      },
      onError: () => {
        showToast(
          "Unerwarteter Fehler",
          "Bitte versuche es später erneut oder kontaktiere einen Administrator.",
        );
      },
    });
  };

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
