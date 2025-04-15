"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { User } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";
import CreateUserDialog from "~/app/dashboard/(admin)/users/(dialogs)/create-user";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {DeleteUserDialog} from "~/app/dashboard/(admin)/users/(dialogs)/delete-user";

export default function UsersTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [data] = api.user.findAll.useSuspenseQuery();
  const [tableData, setTableData] = React.useState<User[]>(data ?? []);
  const columns: ColumnDef<User>[] = [
    {
      header: "Benutzername",
      cell: ({ row }) => <div>{row.original.userName}</div>,
    },
    {
      header: "Anzeigename",
      cell: ({ row }) => <div>{row.original.displayName}</div>,
    },
    {
      header: "Rolle",
      cell: ({ row }) => <div>{row.original.role}</div>,
    },
    {
      header: "Erstellt am",
      cell: ({ row }) => <div>{row.original.createdAt.toLocaleString()}</div>,
    },
    {
      header: "Aktionen",
      cell: ({ row }) => {
        const user = row.original;
        const disabled = user.userName == "admin";
        const text = disabled ? "text-muted" : "";

        return (
          <div className={"flex flex-row"}>
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
      onButtonClick={() => setCreateOpen(true)}
    >
      <CreateUserDialog open={createOpen} setOpen={setCreateOpen} />

      <DeleteUserDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        authMethodId={deleteId}
        onDelete={() => {
          setTableData(tableData.filter((item) => item.id !== deleteId));
        }}
      />
    </DataTable>
  );
}
