"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import type { AuthMethod, User } from "@prisma/client";
import CreateAuthenticationMethodDialog from "~/app/dashboard/(admin)/authentication/(dialogs)/create-auth-method";
import { DeleteAuthenticationMethodDialog } from "~/app/dashboard/(admin)/authentication/(dialogs)/delete-authentication-method";
import { DataTable } from "~/components/ui/data-table";

const showEditForm = (id: number) => {
  console.log("edit: " + id);
};

export default function AuthenticationMethodsTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const { data, isLoading } = api.authMethod.findAll.useQuery();
  const [tableData, setTableData] = React.useState<AuthMethod[]>([]);

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);
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

  return (
    <DataTable
      data={tableData}
      columns={columns}
      loading={isLoading}
      onButtonClick={() => setCreateOpen(true)}
    >
      <CreateAuthenticationMethodDialog
        open={createOpen}
        setOpen={setCreateOpen}
        onCreate={(data) => {
          setTableData([...tableData, data]);
        }}
      />

      <DeleteAuthenticationMethodDialog
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
