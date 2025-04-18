"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { Template } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";
import CreateTemplateDialog from "~/app/dashboard/(admin)/templates/(dialogs)/create-template";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
import { DeleteTemplateDialog } from "~/app/dashboard/(admin)/templates/(dialogs)/delete-template";

export default function TemplateTable() {
  const { data, isLoading } = api.template.findAll.useQuery();
  const [tableData, setTableData] = React.useState<Template[]>([]);
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);
  const columns: ColumnDef<Template>[] = [
    {
      header: "Name",
      cell: ({ row }) => (
        <Link
          className={"font-bold"}
          href={`/dashboard/templates/${row.original.id}`}
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      header: "Beschreibung",
      cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
      header: "Ersteller",
      cell: ({ row }) => {
        const template = row.original;
        const { data: user, isLoading } = api.user.find.useQuery({
          id: template.createdById,
        });

        if (isLoading || !user) return <div>Unbekannt</div>;
        return <div>{user.displayName ?? user.userName}</div>;
      },
    },
    {
      header: "Erstellt am",
      cell: ({ row }) => <div>{row.original.createdAt.toLocaleString()}</div>,
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

      <DeleteTemplateDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        templateId={deleteId}
        onDelete={() => {
          setTableData(tableData.filter((item) => item.id !== deleteId));
        }}
      />
    </DataTable>
  );
}
