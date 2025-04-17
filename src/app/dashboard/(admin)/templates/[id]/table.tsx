"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { TemplateTask } from "@prisma/client";
import { SortableDataTable } from "~/components/ui/sortable-table";
import { useEffect } from "react";

export default function TemplateTaskTable({
  tasks,
}: {
  tasks: TemplateTask[];
}) {
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
      cell: ({ row }) => <div className={"text-center"}>{row.original.description}</div>,
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
      onRowOrderChange={(data) => {
        console.log(data);
      }}
    ></SortableDataTable>
  );
}
