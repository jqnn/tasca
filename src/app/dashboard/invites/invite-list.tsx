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

export default function TeamInvitesTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const acceptMutation = api.teamInvites.accept.useMutation({
    onMutate: () => {
      showToast("Lädt...", "Die Einladung wird angenommen...");
    },
    onSuccess: (data) => {
      if (!data) {
        showErrorToast();
        return;
      }

      showToast("Erfolgreich", "Die Einladung wurde angenommen.");
      router.push(`/dashboard/teams/${data.id}`);
    },
    onError: () => {
      showErrorToast();
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
    centeredColumn("teamId", "Team", (value) => {
      const { data: team, isLoading } = api.team.find.useQuery({ id: value });
      if (isLoading || !team) return "Unbekannt";
      return team.name;
    }),
    centeredColumn("sentAt", "Erhalten am", (value) => value.toLocaleString()),
    TableActions(
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
          loadingMessage={"Die Einladung wird abgelehnt..."}
          successMessage={"Die Einladung wurde abgelehnt."}
        />
      )}
    </DataTable>
  );
}
