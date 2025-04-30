"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { InstanceStatus } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import { centeredColumn } from "~/components/table/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { TaskCheck } from "~/components/instance/task-check";
import { useTranslations } from "next-intl";

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

export default function ProcessTasksTable({
  instances,
  disabled,
}: TasksTableProps) {
  const t = useTranslations()
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
    centeredColumn("task", t("team.common.task"), (value) => (
      <Tooltip>
        <TooltipTrigger>{value.task}</TooltipTrigger>
        {value.description && (
          <TooltipContent>
            <p>{value.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    )),
    centeredColumn("updatedAt", t("team.common.editedAt"), (value) =>
      value.toLocaleString(),
    ),
  ];

  return <DataTable data={tableData} columns={columns} className={"mt-8"} />;
}
