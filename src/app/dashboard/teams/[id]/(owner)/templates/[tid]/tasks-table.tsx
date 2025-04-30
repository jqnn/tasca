"use client";

import * as React from "react";
import { useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/table/sortable-table";
import { api } from "~/trpc/react";
import { showErrorToast, showToast } from "~/lib/utils";
import { centeredColumn } from "~/components/table/table";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import TableActions from "~/components/table/table-actions";
import CreateTemplateTaskDialog from "~/app/dashboard/teams/[id]/(owner)/templates/[tid]/(dialogs)/create-template-task";
import { useTranslations } from "next-intl";

export default function TemplateTaskTable({
  templateId,
  tasks,
}: {
  templateId: number;
  tasks: TemplateTask[];
}) {
  const t = useTranslations()
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [tableData, setTableData] = React.useState<TemplateTask[]>([]);
  const deleteMutation = api.templateTask.delete.useMutation();

  useEffect(() => {
    setTableData(tasks.sort((a, b) => a.order - b.order));
  }, [tasks]);

  const updateTaskOrder = api.templateTask.updateOrder.useMutation({
    onMutate: () => {
      showToast("Lädt", "Die Reihenfolge wird aktualisiert...");
    },
    onSuccess: () => {
      showToast("Erledigt", "Die Reihenfolge wurde aktualisiert.");
    },
    onError: () => {
      showErrorToast();
    },
  });

  const columns: ColumnDef<TemplateTask>[] = [
    centeredColumn("task", "Aufgabe"),
    centeredColumn("description", "Beschreibung"),
    TableActions(t("common.table.actions"),null, (id) => setDeleteId(id)),
  ];

  return (
    <div className="mt-8 w-full">
      <SortableDataTable
        data={tableData}
        columns={columns}
        onButtonClick={() => setCreateOpen(true)}
        onSaveButtonClick={(data) => {
          updateTaskOrder.mutate({
            templateId: templateId,
            tasks: data,
          });
        }}
      >
        {createOpen && (
          <CreateTemplateTaskDialog
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
