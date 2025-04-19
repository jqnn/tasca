"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { Template } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";
import CreateTemplateDialog from "~/app/dashboard/(admin)/templates/(dialogs)/create-template";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn } from "~/components/ui/table";

export default function TemplateTable() {
  const { data, isLoading } = api.template.findAll.useQuery();
  const [tableData, setTableData] = React.useState<Template[]>([]);
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const deleteTemplate = api.template.delete.useMutation();

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);
  const columns: ColumnDef<Template>[] = [
    centeredColumn("name", "Name"),
    centeredColumn("description", "Beschreibung"),
    centeredColumn("createdById", "Ersteller"), // TODO
    centeredColumn("createdAt", "Erstellt am"),
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Aktionen</div>,
      cell: ({ row }) => {
        return (
          <div className={"flex flex-row justify-center"}>
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
    <DataTable
      data={tableData}
      columns={columns}
      loading={isLoading}
      onButtonClick={() => setCreateOpen(true)}
    >
      <CreateTemplateDialog
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
        data={{ id: deleteId }}
        onDelete={() => {
          setTableData(tableData.filter((item) => item.id !== deleteId));
        }}
        mutation={deleteTemplate}
      />
    </DataTable>
  );
}
