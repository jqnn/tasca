"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { Template } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import CreateTemplateDialog from "~/app/dashboard/(admin)/templates/(dialogs)/create-template";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import Spinner from "~/components/ui/spinner";

export default function TemplateTable() {
  const { data, status } = api.template.findAll.useQuery();
  const [tableData, setTableData] = React.useState<Template[]>([]);
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const deleteMutation = api.template.delete.useMutation();

  React.useEffect(() => {
    setTableData(data ?? []);
  }, [data]);

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<Template>[] = [
    centeredColumn("name", "Name", null, "/dashboard/templates/:id"),
    centeredColumn("description", "Beschreibung"),
    centeredColumn("createdById", "Ersteller", (value) => {
      const { data: user, isLoading } = api.user.find.useQuery({ id: value });
      if (isLoading || !user) return "Unbekannt";
      return user.displayName ?? user.userName;
    }),
    centeredColumn("createdAt", "Erstellt am", (value) =>
      value.toLocaleString(),
    ),
    TableActions(null, (id) => setDeleteId(id)),
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      onButtonClick={() => setCreateOpen(true)}
    >
      <CreateTemplateDialog
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
        mutation={deleteMutation}
      />
    </DataTable>
  );
}
