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

export function DeleteTemplateTaskDialog({
  open,
  setOpen,
  templateTaskId,
  onDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  templateTaskId: number | null;
  onDelete?: () => void | null;
}) {
  const handleConfirm = () => {
    if (templateTaskId === null) {
      setOpen(false);
      return;
    }

    deleteTemplateTask.mutate(
      { id: templateTaskId },
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

  const deleteTemplateTask = api.templateTask.delete.useMutation();

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
