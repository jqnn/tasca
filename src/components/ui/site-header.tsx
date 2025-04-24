import type { ReactNode } from "react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";

export function SiteHeader({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {children}
      </div>
    </header>
  );
}

export function SiteTitle({ title }: { title: string }) {
  return <h1 className="text-base font-medium">{title}</h1>;
}

export function SiteDescription({ description }: { description: string }) {
  return (
    <>
      <br />
      <h1 className={cn("text-muted-foreground text-sm")}>{description}</h1>
    </>
  );
}
