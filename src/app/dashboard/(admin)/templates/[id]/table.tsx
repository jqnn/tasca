"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/table/sortable-table";
import { useEffect } from "react";
import CreateTemplateTaskDialog from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/create-template-task";
import { api } from "~/trpc/react";
import { showToast } from "~/lib/utils";
import { centeredColumn } from "~/components/table/table";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import TableActions from "~/components/table/table-actions";

export default function TemplateTaskTable({
  templateId,
  tasks,
}: {
  templateId: number;
  tasks: TemplateTask[];
}) {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [tableData, setTableData] = React.useState<TemplateTask[]>([]);
  const deleteTemplateTask = api.templateTask.delete.useMutation();

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
      showToast(
        "Unerwarteter Fehler",
        "Möglicherweise hat diese Authentifiezerungsmethode noch Benutzer.",
      );
    },
  });

  const columns: ColumnDef<TemplateTask>[] = [
    centeredColumn("task", "Aufgabe"),
    centeredColumn("description", "Beschreibung"),
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
          updateTaskOrder.mutate({
            templateId: templateId,
            tasks: data,
          });
        }}
      >
        <CreateTemplateTaskDialog
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
          mutation={deleteTemplateTask}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => {
            setTableData(tableData.filter((item) => item.id !== deleteId));
          }}
        />
      </SortableDataTable>
    </div>
  );
}
