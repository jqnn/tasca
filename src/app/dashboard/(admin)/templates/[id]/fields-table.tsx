"use client";

import * as React from "react";
import { useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateField } from "@prisma/client";
import { SortableDataTable } from "~/components/table/sortable-table";
import { api } from "~/trpc/react";
import { centeredColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import CreateTemplateFieldDialog from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/create-template-field";
import { showErrorToast, showToast } from "~/lib/utils";

export default function TemplateFieldsTable({
  templateId,
  fields,
}: {
  templateId: number;
  fields: TemplateField[];
}) {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [tableData, setTableData] = React.useState<TemplateField[]>([]);

  const deleteMutation = api.templateField.delete.useMutation();
  const updateOrderMutation = api.templateField.updateOrder.useMutation({
    onMutate: () => {
      showToast("Lädt", "Die Reihenfolge wird aktualisiert...");
    },
    onSuccess: () => {
      showToast("Erledigt", "Die Reihenfolge wurde aktualisiert.");
    },
    onError: () => {
      showErrorToast()
    },
  });

  useEffect(() => {
    setTableData(fields.sort((a, b) => a.order - b.order));
  }, [fields]);

  const columns: ColumnDef<TemplateField>[] = [
    centeredColumn("label", "Bezeichnung"),
    centeredColumn("placeHolder", "Platzhalter"),
    centeredColumn("fieldType", "Typ"),
    TableActions(null, (id) => setDeleteId(id)),
  ];

  return (
    <div className="mt-8 w-full">
      <SortableDataTable
        data={tableData}
        columns={columns}
        loading={false}
        onButtonClick={() => setCreateOpen(true)}
        onSaveButtonClick={(data) => {
          updateOrderMutation.mutate({
            templateId: templateId,
            fields: data,
          });
        }}
      >

        <CreateTemplateFieldDialog
          templateId={templateId}
          order={tableData.length + 1}
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
          mutation={deleteMutation}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => {
            setTableData(tableData.filter((item) => item.id !== deleteId));
          }}
        />
      </SortableDataTable>
    </div>
  );
}
