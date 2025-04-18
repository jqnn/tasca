"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { User } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";
import CreateUserDialog from "~/app/dashboard/(admin)/users/(dialogs)/create-user";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DeleteUserDialog } from "~/app/dashboard/(admin)/users/(dialogs)/delete-user";

export default function UsersTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const { data, isLoading } = api.user.findAll.useQuery();
  const [tableData, setTableData] = React.useState<User[]>([]);

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "userName",
      header: () => <div className="text-center">Benutzername</div>,
      cell: ({ row }) => <div className={"text-center"}>{row.original.userName}</div>,
    },
    {
      accessorKey: "displayName",
      header: () => <div className="text-center">Anzeigename</div>,
      cell: ({ row }) => <div className={"text-center"}>{row.original.displayName}</div>,
    },
    {
      accessorKey: "role",
      header: () => <div className="text-center">Rolle</div>,
      cell: ({ row }) => <div className={"text-center"}>{row.original.role}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Erstellt am</div>,
      cell: ({ row }) => <div className={"text-center"}>{row.original.createdAt.toLocaleString()}</div>,
    },
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

      <DeleteUserDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (!value) setDeleteId(null);
        }}
        authMethodId={deleteId}
        onDelete={() => {
          setTableData((prev) => prev.filter((item) => item.id !== deleteId));
        }}
      />
    </DataTable>
  );
}
