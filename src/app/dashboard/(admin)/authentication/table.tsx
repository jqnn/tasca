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
import Spinner from "~/components/ui/spinner";
import { useTranslations } from "next-intl";

export default function AuthenticationMethodsTable() {
  const t = useTranslations();
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const { data, status } = api.authMethod.findAll.useQuery();
  const [tableData, setTableData] = React.useState<AuthMethod[]>([]);
  const deleteMutation = api.authMethod.delete.useMutation();

  React.useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<AuthMethod>[] = [
    centeredColumn("description", t("common.description")),
    centeredColumn("type", t("common.type")),
    centeredDataColumn(t("common.user"), (method) => {
      const { data: users, isLoading } = api.authMethod.countUsers.useQuery({
        id: method.id,
      });
      if (isLoading || !users) return "0";
      return `${users}`;
    }),
    TableActions(
      t("common.table.actions"),
      null,
      (id) => setDeleteId(id),
      (value) => value.description == "local",
    ),
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      onButtonClick={() => setCreateOpen(true)}
    >
      {createOpen && (
        <CreateAuthenticationMethodDialog
          open={createOpen}
          setOpen={setCreateOpen}
          onCreate={(data) => {
            setTableData([...tableData, data]);
          }}
        />
      )}

      {deleteId !== null && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (value) return;
            setDeleteId(null);
          }}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => {
            setTableData(tableData.filter((item) => item.id !== deleteId));
          }}
          mutation={deleteMutation}
        />
      )}
    </DataTable>
  );
}
