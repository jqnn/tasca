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
import type { AuthMethod } from "@prisma/client";
import CreateAuthenticationMethodDialog from "~/app/dashboard/(admin)/authentication/(dialogs)/create-auth-method";
import { DeleteAuthenticationMethodDialog } from "~/app/dashboard/(admin)/authentication/(dialogs)/delete-authentication-method";

const showEditForm = (id: number) => {
  console.log("edit: " + id);
};

export function DataTableDemo() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [data] = api.authMethod.findAll.useSuspenseQuery();
  const tableData = data ?? [];
  const columns: ColumnDef<AuthMethod>[] = [
    {
      header: "Beschreibung",
      cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
      header: "Typ",
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      header: "Aktionen",
      cell: ({ row }) => {
        const authMethod = row.original;
        const disabled = authMethod.description == "local";
        const text = disabled ? "text-muted" : "";

        return (
          <div className={"flex flex-row"}>
            <IconEdit
              className={"hover:cursor-pointer " + text}
              onClick={() => {
                if (disabled) return;
                showEditForm(authMethod.id);
              }}
            />
            <IconTrash
              className={"hover:cursor-pointer " + text}
              onClick={() => {
                if (disabled) return;
                setDeleteId(authMethod.id);
              }}
            />
          </div>
        );
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
      <div className="flex items-center pb-4">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setCreateOpen(true)}
        >
          Hinzufügen
        </Button>
      </div>

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

      <DeleteAuthenticationMethodDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        authMethodId={deleteId}
      />

      <CreateAuthenticationMethodDialog
        open={createOpen}
        setOpen={setCreateOpen}
      />
    </div>
  );
}
