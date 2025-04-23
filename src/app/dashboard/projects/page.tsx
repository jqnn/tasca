import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import * as React from "react";
import { ProjectList } from "~/app/dashboard/projects/projects-list";

export default function Tasks() {
  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Projekte"} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <div className={"w-full"}>
            <ProjectList />
          </div>
        </div>
      </main>
    </>
  );
}
