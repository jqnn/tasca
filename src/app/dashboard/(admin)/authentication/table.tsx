"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import CreateAuthenticationMethodDialog from "~/app/dashboard/(admin)/authentication/(dialogs)/create-auth-method";
import { DeleteAuthenticationMethodDialog } from "~/app/dashboard/(admin)/authentication/(dialogs)/delete-authentication-method";
import { DataTable } from "~/components/ui/data-table";
import type { AuthMethod } from "@prisma/client";

const showEditForm = (id: number) => {
  console.log("edit: " + id);
};

export default function AuthenticationMethodsTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const { data, isLoading } = api.authMethod.findAll.useQuery();
  const [tableData, setTableData] = React.useState<AuthMethod[]>([]);

  React.useEffect(() => {
    if (!isLoading && data) {
      setTableData(data);
    }
  }, [data, isLoading]);

  const columns: ColumnDef<AuthMethod>[] = [
    {
      accessorKey: "description",
      header: () => <div className="text-center">Beschreibung</div>,
      cell: ({ row }) => (
        <div className={"text-center"}>{row.original.description}</div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="text-center">Typ</div>,
      cell: ({ row }) => (
        <div className={"text-center"}>{row.original.type}</div>
      ),
    },
    {
      accessorKey: "users",
      header: () => <div className="text-center">Benutzer</div>,
      cell: ({ row }) => {
        const authMethod = row.original;
        const { data: users, isLoading } = api.user.countAuthMethodUsers.useQuery({
          id: authMethod.id,
        });
        if (isLoading || !users) return <div className={"text-center"}>0</div>;
        return <div className={"text-center"}>{users}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Aktionen</div>,
      cell: ({ row }) => {
        const authMethod = row.original;
        const disabled = authMethod.description == "local";
        const text = disabled ? "text-muted" : "";

        return (
          <div className={"flex flex-row justify-center"}>
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
