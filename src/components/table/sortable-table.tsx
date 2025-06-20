"use client";

import * as React from "react";
import { forwardRef, type ReactNode, useEffect, useState } from "react";
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

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";

interface HasId {
  id?: string | number;
}

interface DataTableProps<TData extends HasId> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onButtonClick?: (() => void) | null;
  buttonText?: string | null;
  children?: ReactNode | null;
  onSaveButtonClick?: (newData: TData[]) => void;
  getRowId?: (row: TData, index: number) => string;
}

export function SortableDataTable<TData extends HasId>({
  data,
  columns,
  onButtonClick,
  buttonText,
  children,
  onSaveButtonClick,
  getRowId,
}: DataTableProps<TData>): React.JSX.Element {
  const t = useTranslations();
  const [items, setItems] = useState<TData[]>(data);
  const [updated, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const getId = React.useCallback(
    (row: TData, index: number): string =>
      getRowId
        ? getRowId(row, index)
        : row.id !== undefined
          ? String(row.id)
          : index.toString(),
    [getRowId],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((row, i) => getId(row, i) === active.id);
      const newIndex = items.findIndex((row, i) => getId(row, i) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      setUpdate(true);
    }
  }

  type SortableTableRowProps = {
    id: string;
    children: React.ReactNode;
  };

  const SortableTableRow = forwardRef<
    HTMLTableRowElement,
    SortableTableRowProps
  >(({ id, children }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <TableRow
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref && typeof ref === "object") {
            if (node) {
              (ref as React.RefObject<HTMLTableRowElement>).current = node;
            }
          }
        }}
        style={style}
        {...attributes}
      >
        <TableCell className="w-8 px-2">
          <span {...listeners}>
            <GripVertical className="text-muted-foreground" />
          </span>
        </TableCell>
        {children}
      </TableRow>
    );
  });
  SortableTableRow.displayName = "SortableTableRow";

  return (
    <div className="w-full">
      {onButtonClick && (
        <div className="flex items-center pb-4">
          <Button variant="outline" className="mr-auto" onClick={onButtonClick}>
            {buttonText ?? t("common.add")}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((row, i) => getId(row, i))}
            strategy={verticalListSortingStrategy}
          >
            <Table className={"overflow-hidden"}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <TableHead className="w-8 px-2" />
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
                {items.length ? (
                  items.map((row, rowIndex) => {
                    const rowId = getId(row, rowIndex);
                    const tableRow = table.getRowModel().rows[rowIndex];
                    if (!tableRow) return null;

                    return (
                      <SortableTableRow key={rowId} id={rowId}>
                        {tableRow.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </SortableTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      className="text-center"
                      colSpan={columns.length + 1}
                    >
                      {t("common.table.no-results")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>

      {updated && onSaveButtonClick && (
        <div className="flex items-center pt-4">
          <Button
            variant="default"
            className="mr-auto"
            onClick={() => {
              onSaveButtonClick(items);
              setUpdate(false);
            }}
          >
            {t("common.table.save-order.text")}
          </Button>
        </div>
      )}

      {children}
    </div>
  );
}
