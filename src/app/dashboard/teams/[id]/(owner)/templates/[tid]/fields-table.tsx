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
import { showErrorToast, showToast } from "~/lib/utils";
import CreateTemplateFieldDialog from "~/app/dashboard/teams/[id]/(owner)/templates/[tid]/(dialogs)/create-template-field";
import { useTranslations } from "next-intl";

export default function TemplateFieldsTable({
  templateId,
  fields,
}: {
  templateId: number;
  fields: TemplateField[];
}) {
  const t = useTranslations();
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [tableData, setTableData] = React.useState<TemplateField[]>([]);

  const deleteMutation = api.templateField.delete.useMutation();
  const updateOrderMutation = api.templateField.updateOrder.useMutation({
    onMutate: () => {
      showToast(
        t("common.table.save-ordFFer.loading.title"),
        t("common.table.save-order.loading.message"),
      );
    },
    onSuccess: () => {
      showToast(
        t("common.table.save-order.success.title"),
        t("common.table.save-order.success.message"),
      );
    },
    onError: () => {
      showErrorToast(t);
    },
  });

  useEffect(() => {
    setTableData(fields.sort((a, b) => a.order - b.order));
  }, [fields]);

  const columns: ColumnDef<TemplateField>[] = [
    centeredColumn("label", t("team.field.label")),
    centeredColumn("placeHolder", t("team.field.placeHolder")),
    centeredColumn("fieldType", "common.type"),
    TableActions(t("common.table.actions"), null, (id) => setDeleteId(id)),
  ];

  return (
    <div className="mt-8 w-full">
      <SortableDataTable
        data={tableData}
        columns={columns}
        onButtonClick={() => setCreateOpen(true)}
        onSaveButtonClick={(data) => {
          updateOrderMutation.mutate({
            templateId: templateId,
            fields: data,
          });
        }}
      >
        {createOpen && (
          <CreateTemplateFieldDialog
            templateId={templateId}
            order={tableData.length + 1}
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
            mutation={deleteMutation}
            data={{ id: deleteId ?? 0 }}
            onDelete={() => {
              setTableData(tableData.filter((item) => item.id !== deleteId));
            }}
          />
        )}
      </SortableDataTable>
    </div>
  );
}
