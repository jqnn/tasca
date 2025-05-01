"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import type { Template } from "@prisma/client";
import { DataTable } from "~/components/table/data-table";
import CreateTemplateDialog from "~/app/dashboard/teams/[id]/(owner)/templates/(dialogs)/create-template";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { centeredColumn } from "~/components/table/table";
import TableActions from "~/components/table/table-actions";
import Spinner from "~/components/ui/spinner";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

export default function TeamTemplatesTable() {
  const t = useTranslations();
  const team = useTeam();
  const { data, status } = api.template.findAll.useQuery({
    teamId: team.team.id,
  });
  const [tableData, setTableData] = React.useState<Template[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const deleteMutation = api.template.delete.useMutation();

  React.useEffect(() => {
    setTableData(data ?? []);
  }, [data]);

  if (!team) {
    return notFound();
  }

  if (status !== "success") {
    return <Spinner />;
  }

  const columns: ColumnDef<Template>[] = [
    centeredColumn(
      "name",
      t("common.name"),
      null,
      `/dashboard/teams/${team.team.id}/templates/:id`,
    ),
    centeredColumn("description", t("common.description")),
    centeredColumn("createdById", t("common.creator"), (value) => {
      if (!value) return t("common.unknown");
      const { data: user, isLoading } = api.user.find.useQuery({ id: value });
      if (isLoading || !user) return t("common.unknown");
      return user.displayName ?? user.userName;
    }),
    centeredColumn("createdAt", t("common.createdAt"), (value) =>
      value.toLocaleString(),
    ),
    TableActions(t("common.table.actions"), null, (id) => setDeleteId(id)),
  ];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      onButtonClick={() => setShowModal(true)}
    >
      {showModal && (
        <CreateTemplateDialog
          open={showModal}
          setOpen={setShowModal}
          onCreate={(data) => {
            setTableData([...tableData, data]);
          }}
        />
      )}

      {deleteId !== null && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (value) return;
            setDeleteId(null);
          }}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => {
            setTableData(tableData.filter((item) => item.id !== deleteId));
          }}
          mutation={deleteMutation}
        />
      )}
    </DataTable>
  );
}
