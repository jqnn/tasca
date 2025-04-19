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
    {
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => (
        <Link
          className={"font-bold text-center"}
          href={`/dashboard/templates/${row.original.id}`}
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Beschreibung</div>,
      cell: ({ row }) => (
        <div className={"text-center"}>{row.original.description}</div>
      ),
    },
    {
      accessorKey: "creator",
      header: () => <div className="text-center">Ersteller</div>,
      cell: ({ row }) => {
        const template = row.original;
        const { data: user, isLoading } = api.user.find.useQuery({
          id: template.createdById,
        });

        if (isLoading || !user) return <div className={"text-center"}>Unbekannt</div>;
        return <div className={"text-center"}>{user.displayName ?? user.userName}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Erstellt am</div>,
      cell: ({ row }) => (
        <div className={"text-center"}>{row.original.createdAt.toLocaleString()}</div>
      ),
    },
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
