import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import * as React from "react";
import { TeamList } from "~/app/dashboard/teams/projects-list";

export default function Tasks() {
  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Teams"} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <div className={"w-full"}>
            <TeamList />
          </div>
        </div>
      </main>
    </>
  );
}
