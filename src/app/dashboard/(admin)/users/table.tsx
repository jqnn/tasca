"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { User } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";
import CreateUserDialog from "~/app/dashboard/(admin)/users/(dialogs)/create-user";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn } from "~/components/ui/table";

export default function UsersTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const { data, isLoading } = api.user.findAll.useQuery();
  const [tableData, setTableData] = React.useState<User[]>([]);
  const deleteUser = api.user.delete.useMutation();

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);

  const columns: ColumnDef<User>[] = [
    centeredColumn("userName", "Benutzername"),
    centeredColumn("displayName", "Anzeigename"),
    centeredColumn("role", "Anzeigename"),
    centeredColumn("createdAt", "Erstellt am", (value) => value.toLocaleString()),
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Aktionen</div>,
      cell: ({ row }) => {
        const user = row.original;
        const disabled = user.userName == "admin";
        const text = disabled ? "text-muted" : "";

        return (
          <div className={"flex flex-row justify-center gap-2"}>
            <IconEdit
              className={"hover:cursor-pointer " + text}
              onClick={() => {
                if (disabled) return;
              }}
            />
            <IconTrash
              className={"hover:cursor-pointer " + text}
              onClick={() => {
                if (disabled) return;
                setDeleteId(user.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      loading={isLoading}
      onButtonClick={() => setCreateOpen(true)}
    >
      <CreateUserDialog
        open={createOpen}
        setOpen={setCreateOpen}
        onCreate={(data) => {
          setTableData((prev) => [...prev, data]);
        }}
      />

      <DeleteDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (!value) setDeleteId(null);
        }}
        mutation={deleteUser}
        data={{ id: deleteId ?? 0 }}
        onDelete={() => {
          setTableData((prev) => prev.filter((item) => item.id !== deleteId));
        }}
      />
    </DataTable>
  );
}
