"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { type Project, type ProjectTask } from "@prisma/client";
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
import { useTranslations } from "next-intl";

export default function ProjectTasksTable({
  project,
  tasks,
}: {
  project: Project;
  tasks: ProjectTask[];
}) {
  const t = useTranslations();
  const [tableData, setTableData] = React.useState<ProjectTask[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const { data, status } = api.teamMember.findAll.useQuery({
    id: project.teamId,
  });

  const updateMutation = api.teamProjects.updateTaskEditor.useMutation({
    onMutate: () => {
      showToast(
        t("team.update-editor.loading.title"),
        t("team.update-editor.loading.message"),
      );
    },
    onSuccess: () => {
      showToast(
        t("team.update-editor.success.title"),
        t("team.update-editor.success.message"),
      );
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
    centeredDataColumn(t("team.common.task"), (value) => (
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
      header: () => (
        <div className="text-center">{t("team.common.editor")}</div>
      ),
      cell: ({ row }) => {
        if (row.original.status == "COMPLETED") {
          if (row.original.editorId == null)
            return <div className={"text-center"}>{t("common.unknown")}</div>;
          const { data: user, isLoading } = api.user.find.useQuery({
            id: row.original.editorId,
          });
          if (isLoading || !user)
            return <div className={"text-center"}>{t("common.unknown")}</div>;
          return (
            <div className={"text-center"}>
              {user.displayName ?? user.userName}
            </div>
          );
        }

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
    centeredColumn("updatedAt", t("team.common.editedAt"), (value) =>
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
