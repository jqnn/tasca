"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/ui/sortable-table";
import { useEffect } from "react";
import CreateTemplateTaskDialog from "~/app/dashboard/(admin)/templates/[id]/(dialogs)/create-template-task";

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
    setTableData(tasks);
  }, [tasks]);

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
      onRowOrderChange={(data) => {
        console.log(data);
      }}
    >
      <CreateTemplateTaskDialog
        templateId={templateId}
        order={tasks.length + 1}
        open={createOpen}
        setOpen={setCreateOpen}
        onCreate={(data) => {
          setTableData([...tableData, data]);
        }}
      />
    </SortableDataTable>
  );
}
