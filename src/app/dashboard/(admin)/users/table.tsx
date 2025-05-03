"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Role, type User } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import CreateUserDialog from "~/app/dashboard/(admin)/users/(dialogs)/create-user";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn, centeredDataColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import { beautifyRole, showErrorToast, showToast } from "~/lib/utils";
import Spinner from "~/components/ui/spinner";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function UsersTable() {
  const t = useTranslations();
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const { data, status } = api.user.findAll.useQuery();
  const [tableData, setTableData] = React.useState<User[]>([]);

  const updateMutation = api.user.updateRole.useMutation({
    onMutate: () => {
      showToast(
        t("user.update.role.loading.title"),
        t("user.update.role.loading.message"),
      );
    },
    onSuccess: () => {
      showToast(
        t("user.update.role.success.title"),
        t("user.update.role.success.message"),
      );
    },
    onError: () => {
      showErrorToast(t);
    },
  });
  const deleteMutation = api.user.delete.useMutation();

  React.useEffect(() => {
    setTableData(data ?? []);
  }, [data]);

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<User>[] = [
    centeredColumn("userName", t("user.userName")),
    centeredColumn("displayName", t("user.displayName")),
    centeredDataColumn(t("common.role"), (user) => {
      if (user.userName == "admin") {
        return beautifyRole(t, user.role);
      }

      return (
        <div className={"flex flex-row justify-center gap-2"}>
          <Select
            defaultValue={user.role}
            onValueChange={(value) => {
              updateMutation.mutate({
                id: user.id,
                role: value as Role,
              });
              user.role = value as Role;
            }}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Role).map((role) => {
                return (
                  <SelectItem key={role} value={role}>
                    {beautifyRole(t, role)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      );
    }),
    centeredColumn("createdAt", t("common.createdAt"), (value) =>
      value.toLocaleString(),
    ),
    TableActions(
      t("common.table.actions"),
      null,
      (id) => setDeleteId(id),
      (value) => value.userName == "admin",
    ),
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      onButtonClick={() => setCreateOpen(true)}
    >
      {createOpen && (
        <CreateUserDialog
          open={createOpen}
          setOpen={setCreateOpen}
          onCreate={(data) => {
            setTableData((prev) => [...prev, data]);
          }}
        />
      )}

      {deleteId !== null && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (!value) setDeleteId(null);
          }}
          mutation={deleteMutation}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => {
            setTableData((prev) => prev.filter((item) => item.id !== deleteId));
          }}
        />
      )}
    </DataTable>
  );
}
