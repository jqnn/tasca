"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { TeamInvite } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import Spinner from "~/components/ui/spinner";
import { useRouter } from "next/navigation";
import { centeredColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { useSession } from "next-auth/react";
import { showErrorToast, showToast } from "~/lib/utils";
import { useTranslations } from "next-intl";

export default function TeamInvitesTable() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const acceptMutation = api.teamInvites.accept.useMutation({
    onMutate: () => {
      showToast(t("user.invite.accept.title"), t("user.invite.accept.message"));
    },
    onSuccess: (data) => {
      if (!data) {
        showErrorToast(t);
        return;
      }

      showToast(
        t("user.invite.accepted.title"),
        t("user.invite.accepted.message"),
      );
      router.push(`/dashboard/teams/${data.teamId}/processes`);
    },
    onError: () => {
      showErrorToast(t);
    },
  });
  const deleteMutation = api.teamInvites.delete.useMutation();

  if (!session) {
    router.push("/");
    return;
  }

  const { data, status } = api.teamInvites.findUsers.useQuery({
    id: session?.user?.id,
  });

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<TeamInvite>[] = [
    centeredColumn("teamId", t("common.team"), (value) => {
      const { data: team, isLoading } = api.team.find.useQuery({ id: value });
      if (isLoading || !team) return t("common.unknown");
      return team.name;
    }),
    centeredColumn("sentAt", t("user.invite.receivedAt"), (value) =>
      value.toLocaleString(),
    ),
    TableActions(
      t("common.table.actions"),
      (value) => acceptMutation.mutate({ id: value }),
      (value) => setDeleteId(value),
    ),
  ];
  return (
    <DataTable data={data} columns={columns}>
      {deleteId && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (value) return;
            setDeleteId(null);
          }}
          data={{ id: deleteId ?? 0 }}
          mutation={deleteMutation}
          onDelete={() => {
            console.log("TODO");
          }}
          mutationMessages={{
            loading: "user.invite.reject",
            success: "user.invite.rejected",
          }}
        />
      )}
    </DataTable>
  );
}
