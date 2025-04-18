"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/ui/sortable-table";
import { useEffect } from "react";
import CreateTemplateTaskDialog from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/create-template-task";
import { api } from "~/trpc/react";
import { showToast } from "~/lib/utils";

export default function TemplateTaskTable({
  templateId,
  tasks,
}: {
  templateId: number;
  tasks: TemplateTask[];
}) {
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [tableData, setTableData] = React.useState<TemplateTask[]>([]);
  useEffect(() => {
    setTableData(tasks.sort((a, b) => a.order - b.order));
  }, [tasks]);

  const updateTaskOrder = api.templateTask.updateOrder.useMutation({
    onMutate: () => {
      showToast("Lädt", "Die Reihenfolge wird aktualisiert...")
    },
    onSuccess: () => {
      showToast("Erledigt", "Die Reihenfolge wurde aktualisiert.")
    },
    onError: () => {
      showToast(
        "Unerwarteter Fehler",
        "Möglicherweise hat diese Authentifiezerungsmethode noch Benutzer.",
      );
    }
  });

  const columns: ColumnDef<TemplateTask>[] = [
    {
      accessorKey: "task",
      header: () => <div className="text-center">Aufgabe</div>,
      cell: ({ row }) => <div className="text-center">{row.original.task}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Beschreibung</div>,
      cell: ({ row }) => (
        <div className={"text-center"}>{row.original.description}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Aktionen</div>,
      cell: ({ row }) => <div className={"text-center"}>TODO</div>,
    },
  ];

  return (
    <SortableDataTable
      data={tableData}
      columns={columns}
      loading={false}
      onButtonClick={() => setCreateOpen(true)}
      onSaveButtonClick={(data) => {
        updateTaskOrder.mutate({
          templateId: templateId,
          tasks: data,
        })
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
    </SortableDataTable>
  );
}
