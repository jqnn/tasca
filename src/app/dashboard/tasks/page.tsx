import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import * as React from "react";
import { TaskList } from "~/app/dashboard/tasks/task-list";
import { Button } from "~/components/ui/button";

export default function Tasks() {
  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Aufgaben"} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <div className={"w-full"}>
            <div className="flex items-center pb-4">
              <Button variant="outline" className="mr-auto">
                Erstellen
              </Button>
            </div>

            <TaskList />
          </div>
        </div>
      </main>
    </>
  );
}
