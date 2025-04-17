"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { Template } from "@prisma/client";
import { DataTable } from "~/components/ui/data-table";

export default function TemplateTable() {
  const { data, isLoading } = api.template.findAll.useQuery();
  const [tableData, setTableData] = React.useState<Template[]>([]);

  React.useEffect(() => {
    if (!isLoading) {
      setTableData(data ?? []);
    }
  }, [data, isLoading]);
  const columns: ColumnDef<Template>[] = [
    {
      header: "Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      header: "Beschreibung",
      cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
      header: "Ersteller",
      cell: ({ row }) => <div>{row.original.createdById}</div>,
    },
    {
      header: "Erstellt am",
      cell: ({ row }) => <div>{row.original.createdAt.toLocaleString()}</div>,
    },
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      loading={isLoading}
    />
  );
}
