"use client";

import type { ReactNode } from "react";
import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table/table";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useTranslations } from "next-intl";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onButtonClick?: () => void | null;
  buttonText?: string | null;
  children?: ReactNode | null;
  className?: string | undefined;
}

export function DataTable<TData>({
  data,
  columns,
  onButtonClick,
  buttonText,
  children,
  className,
}: DataTableProps<TData>) {
  const t = useTranslations();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("w-full", className)}>
      {onButtonClick && (
        <div className="flex items-center pb-4">
          <Button variant="outline" className="mr-auto" onClick={onButtonClick}>
            {buttonText ?? t("common.add")}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className={"text-center"} colSpan={columns.length}>
                  {t("common.table.no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {children}
    </div>
  );
}
