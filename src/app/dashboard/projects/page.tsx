import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { ProjectsList } from "~/app/dashboard/projects/project-list";

export default async function Projects() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Projekte"} />
      </SiteHeader>
      <main
        className={
          "flex shrink-0 items-center gap-2 transition-[width,height] ease-linear"
        }
      >
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <div className={"w-full"}>
            <div className="flex items-center pb-4">
              <Button variant="outline" className="mr-auto">
                Erstellen
              </Button>
            </div>

            <ProjectsList />
          </div>
        </div>
      </main>
    </>
  );
}
