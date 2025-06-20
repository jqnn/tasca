"use client";

import type { ReactNode } from "react";
import * as React from "react";

import { cn } from "~/lib/utils";
import type { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

interface RowData {
  id: number;
}

function centeredColumn<TData extends RowData, TKey extends keyof TData>(
  accessorKey: TKey,
  headerText: string,
  formatter?: ((value: TData[TKey]) => string | ReactNode) | null,
  href?: string | null,
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header: () => <div className="text-center">{headerText}</div>,
    cell: ({ row }: { row: Row<TData> }) => {
      const value = row.original[accessorKey];
      if (value === undefined || value === null) {
        return null;
      }

      const formattedValue = formatter ? formatter(value) : String(value);

      if (href) {
        const id = row.original.id ?? 0;
        return (
          <div className="text-center">
            <Link
              href={href.replaceAll(":id", String(id))}
              className={"font-bold"}
            >
              {formattedValue}
            </Link>
          </div>
        );
      } else {
        return <div className="text-center">{formattedValue}</div>;
      }
    },
  };
}

function centeredDataColumn<TData extends RowData>(
  headerText: string,
  formatter?: ((value: TData) => string | ReactNode) | null,
  href?: string | null,
): ColumnDef<TData> {
  return {
    accessorKey: "custom",
    header: () => <div className="text-center">{headerText}</div>,
    cell: ({ row }: { row: Row<TData> }) => {
      const formattedValue = formatter
        ? formatter(row.original)
        : String(row.original.id);

      if (href) {
        const id = row.original.id ?? 0;
        return (
          <div className="text-center">
            <Link
              href={href.replaceAll(":id", String(id))}
              className={"font-bold"}
            >
              {formattedValue}
            </Link>
          </div>
        );
      } else {
        return <div className="text-center">{formattedValue}</div>;
      }
    },
  };
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  centeredColumn,
  centeredDataColumn,
};
