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
import { showErrorToast, showToast } from "~/lib/utils";

type MutationInput = {
  id: number;
};
type MutationOutput = unknown;
type MutationError = unknown;
type MutationContext = unknown;

export function DeleteDialog({
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
  mutation: UseTRPCMutationResult<
    MutationOutput,
    MutationError,
    MutationInput,
    MutationContext
  >;
  data: MutationInput;
  onDelete?: () => void | null;
  loadingMessage?: string | null;
  successMessage?: string | null;
}) {
  const handleConfirm = () => {
    if (!data) {
      showErrorToast();
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
        showErrorToast();
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
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={handleConfirm}
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
