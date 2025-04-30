"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import type { Project, ProjectTask } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import { centeredColumn, centeredDataColumn } from "~/components/table/table";
import { ProjectTaskCheck } from "~/components/instance/task-check";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import CreateProjectTaskDialog from "~/app/dashboard/teams/[id]/(users)/projects/[pid]/(dialogs)/create-project-task";
import { api } from "~/trpc/react";

export default function ProjectTasksTable({
  project,
  tasks,
}: {
  project: Project;
  tasks: ProjectTask[];
}) {
  const [tableData, setTableData] = React.useState<ProjectTask[]>([]);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    setTableData(tasks);
  }, [tasks]);

  const columns: ColumnDef<ProjectTask>[] = [
    {
      accessorKey: "checked",
      header: () => <div />,
      cell: ({ row }) => {
        return <ProjectTaskCheck task={row.original} />;
      },
    },
    centeredDataColumn("Aufgabe", (value) => (
      <Tooltip>
        <TooltipTrigger>{value.task}</TooltipTrigger>
        {value.description && (
          <TooltipContent>
            <p>{value.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    )),
    centeredColumn("editorId", "Bearbeiter", (value) => {
      if (value == null) return "Niemand";
      const { data: user, isLoading } = api.user.find.useQuery({ id: value });
      if (isLoading || !user) return "Unbekannt";
      return user.displayName ?? user.userName;
    }),
    centeredColumn("updatedAt", "Bearbeitet am", (value) =>
      value.toLocaleString(),
    ),
  ];

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        className={"mt-8"}
        onButtonClick={() => setShowModal(true)}
      />

      {showModal && (
        <CreateProjectTaskDialog
          open={showModal}
          setOpen={setShowModal}
          projectId={project.id}
          onCreate={(data) => {
            setTableData((prev) => [...prev, data]);
          }}
        />
      )}
    </>
  );
}
