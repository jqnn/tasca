import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type { FormEvent } from "react";
import * as React from "react";
import { api } from "~/trpc/react";
import SearchDropdown from "~/components/search";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { showErrorToast, showToast } from "~/lib/utils";
import { useTranslations } from "next-intl";

export default function InviteTeamMemberDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const t = useTranslations();

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    if (!userId) {
      showErrorToast(t, "team.invite.no-selected");
      return;
    }

    existsMutation.mutate(
      {
        userId: userId,
        teamId: team.team.id,
      },
      {
        onSuccess: (data) => {
          if (data) {
            showErrorToast(
              t,
              "team.invite.already-joined",
            );
            return;
          }

          inviteMutation.mutate(
            {
              userId: userId,
              teamId: team.team.id,
            },
            {
              onSuccess: () => {
                showToast(
                  t("team.invite.sent.title")
                  t("team.invite.sent.message")
                );
              },
              onError: () => {
                showErrorToast(
                  t,
                  "team.invite.already-invited",
                );
              },
            },
          );
        },
        onError: () => {
          showErrorToast(t);
        },
      },
    );
  };

  const team = useTeam();
  const [userId, setUserId] = React.useState<number | null>(null);
  const { data, status } = api.user.findAll.useQuery();
  const existsMutation = api.teamMember.isMemberMutation.useMutation();
  const inviteMutation = api.teamInvites.create.useMutation();

  if (!team) {
    return notFound();
  }

  if (status !== "success") {
    return <Spinner />;
  }

  const mappedData = data.map((value) => {
    return {
      id: value.id,
      name: value.userName,
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Einladung</DialogTitle>
          <DialogDescription>
            Lade einen Benutzer zu diesem Team ein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full gap-4 py-4">
            <SearchDropdown
              data={mappedData}
              label={"Benutzer"}
              setSelected={(value) => setUserId(value.id)}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={existsMutation.isPending || inviteMutation.isPending}
            >
              Einladen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
