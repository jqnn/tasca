"use client";

import * as React from "react";
import {
  type ColumnDef,
} from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { User } from "@prisma/client";
import {DataTable} from "~/components/ui/data-table";

export default function UsersTable() {
  const [data] = api.user.findAll.useSuspenseQuery();
  const tableData = data ?? [];
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
      cell: () => {
        return <div>TODO</div>;
      },
    },
  ];

  return (
      <DataTable data={tableData} columns={columns} onButtonClick={() => console.log("TODO")} />
  );
}
