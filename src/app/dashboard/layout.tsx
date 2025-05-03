import "~/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { SidebarComponent } from "~/components/navigation/sidebar/sidebar";

export const metadata: Metadata = {
  title: "tasca | Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <SidebarComponent variant="inset" />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
