"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import CreateAuthenticationMethodDialog from "~/app/dashboard/(admin)/authentication/(dialogs)/create-auth-method";
import { DataTable } from "~/components/table/data-table";
import type { AuthMethod } from "@prisma/client";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn, centeredDataColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";

export default function AuthenticationMethodsTable() {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const { data, isLoading } = api.authMethod.findAll.useQuery();
  const [tableData, setTableData] = React.useState<AuthMethod[]>([]);
  const deleteAuthMethod = api.authMethod.delete.useMutation();

  React.useEffect(() => {
    if (!isLoading && data) {
      setTableData(data);
    }
  }, [data, isLoading]);

  const columns: ColumnDef<AuthMethod>[] = [
    centeredColumn("description", "Beschreibung"),
    centeredColumn("type", "Typ"),
    centeredDataColumn("Benutzer", (id) => {
      const { data: users, isLoading } = api.user.countAuthMethodUsers.useQuery(
        { id: id },
      );
      if (isLoading || !users) return "0";
      return `${users}`;
    }),
    TableActions(
      null,
      (id) => setDeleteId(id),
      (value) => value.description == "local",
    ),
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

      <DeleteDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        data={{ id: deleteId ?? 0 }}
        onDelete={() => {
          setTableData(tableData.filter((item) => item.id !== deleteId));
        }}
        mutation={deleteAuthMethod}
      />
    </DataTable>
  );
}
