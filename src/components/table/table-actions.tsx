import type { Row } from "@tanstack/react-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import * as React from "react";

interface RowData {
  id: number;
}

export default function TableActions<TData extends RowData>(
  title: string,
  onEditClick?: ((value: number) => void) | null,
  onDeleteClick?: ((value: number) => void) | null,
  disabled?: ((value: TData) => boolean) | null,
) {
  return {
    accessorKey: "actions",
    header: () => <div className={"text-center"}>{title}</div>,
    cell: ({ row }: { row: Row<TData> }) => {
      const id = row.original.id ?? 0;
      const value = row.original;
      if (value === undefined || value === null) {
        return null;
      }
      const isDisabled = disabled ? disabled(value) : false;
      const disabledStyle = isDisabled ? "text-muted" : "";

      return (
        <div className={"flex flex-row justify-center gap-2"}>
          {onEditClick && (
            <IconEdit
              className={`hover:cursor-pointer ${disabledStyle}`}
              onClick={() => {
                if (isDisabled) return;
                if (!onEditClick) return;
                onEditClick(id);
              }}
            />
          )}
          {onDeleteClick && (
            <IconTrash
              className={`hover:cursor-pointer ${disabledStyle}`}
              onClick={() => {
                if (isDisabled) return;
                if (!onDeleteClick) return;
                onDeleteClick(id);
              }}
            />
          )}
        </div>
      );
    },
  };
}
