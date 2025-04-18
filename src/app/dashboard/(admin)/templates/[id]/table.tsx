"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/ui/sortable-table";
import { useEffect } from "react";
import CreateTemplateTaskDialog from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/create-template-task";
import { api } from "~/trpc/react";
import { showToast } from "~/lib/utils";
import { IconTrash } from "@tabler/icons-react";
import { DeleteTemplateTaskDialog } from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/delete-template-task";

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
      cell: ({ row }) => {
        return (
          <div className={"flex flex-row justify-center text-center"}>
            <IconTrash
              className={"text-center hover:cursor-pointer"}
              onClick={() => {
                setDeleteId(row.original.id);
              }}
            />
          </div>
        );
      },
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

      <DeleteTemplateTaskDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        templateTaskId={deleteId}
        onDelete={() => {
          setTableData(tableData.filter((item) => item.id !== deleteId));
        }}
      />
    </SortableDataTable>
  );
}
