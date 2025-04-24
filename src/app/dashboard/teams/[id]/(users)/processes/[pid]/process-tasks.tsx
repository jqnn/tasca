"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { InstanceStatus } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import { centeredColumn } from "~/components/table/table";
import TaskCheck from "~/components/instance/task-check";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type InstanceType = {
  task: {
    id: number;
    description: string;
    templateId: number;
    task: string;
    order: number;
  };
} & {
  id: number;
  status: InstanceStatus;
  updatedAt: Date;
  instanceId: number;
  taskId: number;
};

interface TasksTableProps {
  instances: InstanceType[];
  disabled: boolean;
}

export default function ProcessTasksTable({ instances, disabled }: TasksTableProps) {
  const [tableData, setTableData] = React.useState<InstanceType[]>([]);

  React.useEffect(() => {
    setTableData(instances);
  }, [instances]);

  const columns: ColumnDef<InstanceType>[] = [
    {
      accessorKey: "checked",
      header: () => <div />,
      cell: ({ row }) => {
        return <TaskCheck instance={row.original} disabled={disabled} />;
      },
    },
    centeredColumn("task", "Aufgabe", (value) => (
      <Tooltip>
        <TooltipTrigger>{value.task}</TooltipTrigger>
        {value.description && (
          <TooltipContent>
            <p>{value.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    )),
    centeredColumn("updatedAt", "Bearbeitet am", (value) =>
      value.toLocaleString(),
    ),
  ];

  return <DataTable data={tableData} columns={columns} className={"mt-8"} />;
}
