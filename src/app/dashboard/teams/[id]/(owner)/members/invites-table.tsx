"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { TeamInvite } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { centeredColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import InviteTeamMemberDialog from "~/app/dashboard/teams/[id]/(owner)/members/(dialogs)/invite-team-member";

export default function TeamInvitesTable() {
  const team = useTeam();
  const { data, status } = api.teamInvites.findTeams.useQuery({
    id: team.team.id,
  });
  const [tableData, setTableData] = React.useState<TeamInvite[]>([]);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const deleteMutation = api.teamInvites.delete.useMutation();

  React.useEffect(() => {
    setTableData(data ?? []);
  }, [data]);

  if (!team) {
    return notFound();
  }

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<TeamInvite>[] = [
    centeredColumn("userId", "Benutzer", (value) => {
      const { data: user, isLoading } = api.user.find.useQuery({ id: value });
      if (isLoading || !user) return "Unbekannt";
      return user.displayName ?? user.userName;
    }),
    centeredColumn("sentAt", "Gesendet am", (value) => value.toLocaleString()),
    TableActions(null, (value) => setDeleteId(value)),
  ];

  return (
    <DataTable data={tableData} columns={columns} buttonText={"Einladen"} onButtonClick={() => setShowModal(true)}>
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
            setTableData(tableData.filter((item) => item.userId !== deleteId));
          }}
        />
      )}

      {showModal && (
        <InviteTeamMemberDialog open={showModal} setOpen={(value) => setShowModal(value)} />
      )}
    </DataTable>
  );
}
