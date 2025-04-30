"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { type Project, type ProjectTask, TeamRole } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import { centeredColumn, centeredDataColumn } from "~/components/table/table";
import { ProjectTaskCheck } from "~/components/instance/task-check";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import CreateProjectTaskDialog from "~/app/dashboard/teams/[id]/(users)/projects/[pid]/(dialogs)/create-project-task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import Spinner from "~/components/ui/spinner";
import { showErrorToast, showToast } from "~/lib/utils";

export default function ProjectTasksTable({
  project,
  tasks,
}: {
  project: Project;
  tasks: ProjectTask[];
}) {
  const [tableData, setTableData] = React.useState<ProjectTask[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const { data, status } = api.teamMember.findAll.useQuery({
    id: project.teamId,
  });

  const updateMutation = api.teamProjects.updateTaskEditor.useMutation({
    onMutate: () => {
      showToast("Lädt...", "Der Bearbeiter der Aufgabe wird aktualisert...");
    },
    onSuccess: () => {
      showToast("Erfolgreich", "Der Bearbeiter der Aufgabe wurde aktualisert.");
    },
    onError: () => {
      showErrorToast();
    },
  });

  React.useEffect(() => {
    setTableData(tasks);
  }, [tasks]);

  if (status !== "success") {
    return <Spinner />;
  }

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
    {
      accessorKey: "editorId",
      header: () => <div className="text-center">Bearbeiter</div>,
      cell: ({ row }) => {
        return (
          <div className={"flex flex-row justify-center gap-2"}>
            <Select
              defaultValue={String(row.original.editorId)}
              onValueChange={(value) => {
                updateMutation.mutate({
                  id: row.original.id,
                  editorId: Number(value),
                });
                row.original.editorId = Number(value);
              }}
            >
              <SelectTrigger className="w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.map((value) => (
                  <SelectItem key={value.userId} value={String(value.userId)}>
                    {value.user.displayName ?? value.user.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
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
