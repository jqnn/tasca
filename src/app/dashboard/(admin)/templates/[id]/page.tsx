"use client";

import { notFound, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  SiteDescription,
  SiteHeader,
  SiteTitle,
} from "~/components/ui/site-header";
import TemplateTaskTable from "~/app/dashboard/(admin)/templates/[id]/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TemplateFieldsTable from "~/app/dashboard/(admin)/templates/[id]/fields-table";
import { Button } from "~/components/ui/button";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import Spinner from "~/components/ui/spinner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TemplatePage({ params }: PageProps) {
  const router = useRouter();
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
  }

  const { data: template, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.id)),
  });
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const deleteTemplate = api.template.delete.useMutation();

  if (status !== "success") {
    return <Spinner />;
  }

  if (!template) {
    notFound();
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Vorlage - " + template.name} />
        {template.description && (
          <SiteDescription description={template.description} />
        )}
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full flex-col items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex w-full pb-4">
            <Button variant="outline" className={"mr-2"}>
              Bearbeiten
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteId(template.id)}
            >
              Löschen
            </Button>
          </div>

          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="fields">Felder</TabsTrigger>
              <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
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
        </div>
      </main>

      <DeleteDialog
        open={deleteId !== null}
        setOpen={(value) => {
          if (value) return;
          setDeleteId(null);
        }}
        data={{ id: deleteId ?? 0 }}
        onDelete={() => router.push("/dashboard/templates")}
        mutation={deleteTemplate}
      />
    </>
  );
}
