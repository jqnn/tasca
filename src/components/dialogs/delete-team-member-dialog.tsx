"use client";

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
import { useTranslations } from "next-intl";
import {
  defaultMutationMessages,
  type MutationMessages,
} from "~/types/dialog-types";

type MutationInput = {
  userId: number;
  teamId: number;
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
  mutationMessages = defaultMutationMessages,
  dialogMessages = "common.dialog",
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
  mutationMessages?: MutationMessages;
  dialogMessages?: string;
}) {
  const t = useTranslations();

  const handleConfirm = () => {
    if (!data) {
      showErrorToast(t);
      setOpen(false);
      return;
    }

    showToast(
      t(`${mutationMessages.loading}.title`),
      t(`${mutationMessages.loading}.description`),
    );
    mutation.mutate(data, {
      onSuccess: () => {
        if (!onDelete) {
          window.location.reload();
          return;
        }

        onDelete();
        setOpen(false);
        showToast(
          t(`${mutationMessages.success}.title`),
          t(`${mutationMessages.success}.description`),
        );
      },
      onError: () => {
        showErrorToast(t);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${dialogMessages}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(`${dialogMessages}.description`)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={handleConfirm}
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
