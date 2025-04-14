import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

interface DialogTexts {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export function CustomAlert({
  open,
  setOpen,
  texts,
  onConfirm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  texts?: DialogTexts;
  onConfirm?: () => void;
}) {
  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {texts?.title ?? "Bist du sicher?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {texts?.description ??
              "Diese Aktion kann nicht rückgängig gemacht werden."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {texts?.cancelText ?? "Abbrechen"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {texts?.confirmText ?? "Bestätigen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
