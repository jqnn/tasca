"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import type { AuthMethod, User } from "@prisma/client";
import CreateAuthenticationMethodDialog from "~/app/dashboard/(admin)/authentication/(dialogs)/create-auth-method";
import { DeleteAuthenticationMethodDialog } from "~/app/dashboard/(admin)/authentication/(dialogs)/delete-authentication-method";

const showEditForm = (id: number) => {
  console.log("edit: " + id);
};

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
      cell: ({ row }) => {
        return <div>TODO</div>;
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/*
                        <div className="flex items-center pb-4">
                <Button
                    variant="outline"
                    className="mr-auto"
                    onClick={() => setCreateOpen(true)}
                >
                    Hinzufügen
                </Button>
            </div>
            */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
