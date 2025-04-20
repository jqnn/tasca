import type { ReactNode } from "react";
import * as React from "react";
import { cn } from "~/lib/utils";

export function SiteHeader({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex h-full w-full items-center gap-1 px-4 align-middle lg:gap-2 lg:px-6">
        {children}
      </div>
    </header>
  );
}

export function SiteTitle({ title }: { title: string }) {
  return <h1 className={cn("leading-none font-semibold")}>{title}</h1>;
}

export function SiteDescription({ description }: { description: string }) {
  return (
    <>
      <br />
      <h1 className={cn("text-muted-foreground text-sm")}>{description}</h1>
    </>
  );
}
