"use client";

import { notFound, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import Spinner from "~/components/ui/spinner";
import TemplateTaskTable from "~/app/dashboard/teams/[id]/(owner)/templates/[tid]/tasks-table";
import TemplateFieldsTable from "~/app/dashboard/teams/[id]/(owner)/templates/[tid]/fields-table";

interface PageProps {
  params: Promise<{
    tid: string;
  }>;
}

export default function TemplatePage({ params }: PageProps) {
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [tab, setTab] = React.useState<string>("fields");

  const router = useRouter();
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: template, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.tid)),
  });

  const deleteMutation = api.template.delete.useMutation();

  if (status !== "success") {
    return <Spinner />;
  }

  if (!template) {
    notFound();
  }

  return (
    <>
      <h1 className={"mr-auto mb-4 font-bold"}>Vorlage - {template.name}</h1>
      <div className="flex w-full pb-4">
        <Button variant="outline" className={"mr-2"}>
          Bearbeiten
        </Button>
        <Button variant="destructive" onClick={() => setDeleteId(template.id)}>
          Löschen
        </Button>
      </div>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="fields" onClick={() => setTab("fields")}>
            Felder
          </TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => setTab("tasks")}>
            Aufgaben
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fields">
          <TemplateFieldsTable
            templateId={template.id}
            fields={template.TemplateField ?? []}
          />
        </TabsContent>
        <TabsContent value="tasks">
          <TemplateTaskTable
            templateId={template.id}
            tasks={template.TemplateTask ?? []}
          />
        </TabsContent>
      </Tabs>

      {deleteId !== null && (
        <DeleteDialog
          open={true}
          setOpen={(value) => {
            if (value) return;
            setDeleteId(null);
          }}
          data={{ id: deleteId ?? 0 }}
          onDelete={() => router.push("/dashboard/templates")}
          mutation={deleteMutation}
        />
      )}
    </>
  );
}
