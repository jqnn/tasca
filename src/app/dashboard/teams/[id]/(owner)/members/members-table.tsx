"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { TeamMember } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { IconTrash } from "@tabler/icons-react";
import { DeleteDialog } from "~/components/dialogs/delete-team-member-dialog";
import { beautifyTeamRole } from "~/lib/utils";

export default function TeamMembersTable() {
  const team = useTeam();
  const { data, status } = api.team.findMembers.useQuery({ id: team.team.id });
  const [tableData, setTableData] = React.useState<TeamMember[]>([]);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const removeMutation = api.team.removeMember.useMutation();

  React.useEffect(() => {
    setTableData(data ?? []);
  }, [data]);

  if (!team) {
    return notFound();
  }

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "userId",
      header: () => <div className="text-center">Benutzer</div>,
      cell: ({ row }) => {
        const { data: user, isLoading } = api.user.find.useQuery({
          id: row.original.userId,
        });
        if (isLoading || !user)
          return <div className="text-center">Unbekannt</div>;
        return (
          <div className={"text-center"}>
            {user.displayName ?? user.userName}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: () => <div className="text-center">Rolle</div>,
      cell: ({ row }) => <div className="text-center">{beautifyTeamRole(row.original.role)}</div>,
    },
    {
      accessorKey: "joinedAt",
      header: () => <div className="text-center">Beigetreten am</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.joinedAt.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className={"text-center"}>Aktionen</div>,
      cell: ({ row }) => {
        const original = row.original;
        const isDisabled = original.role == "OWNER";
        const disabledStyle = isDisabled ? "text-muted" : "";

        return (
          <div className={"flex flex-row justify-center gap-2"}>
            <IconTrash
              className={`hover:cursor-pointer ${disabledStyle}`}
              onClick={() => {
                if (isDisabled) return;
                setDeleteId(original.userId);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable data={tableData} columns={columns}>
      {deleteId && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (value) return;
            setDeleteId(null);
          }}
          data={{ userId: deleteId ?? 0, teamId: team.team.id }}
          mutation={removeMutation}
        />
      )}
    </DataTable>
  );
}
