"use client";

import { notFound, redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  SiteDescription,
  SiteHeader,
  SiteHeaderSkeleton,
  SiteTitle,
} from "~/components/ui/site-header";
import TemplateTaskTable from "~/app/dashboard/(admin)/templates/[id]/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TemplateFieldsTable from "~/app/dashboard/(admin)/templates/[id]/fields-table";
import { Button } from "~/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TemplatePage({ params }: PageProps) {
  const actualParams = React.use(params);
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const { data: template, status } = api.template.find.useQuery({
    id: Number(Number(actualParams.id)),
  });

  if (status !== "success") {
    return <SiteHeaderSkeleton />;
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
              onClick={() => console.log("löschen")}
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
    </>
  );
}
