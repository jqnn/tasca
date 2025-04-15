"use client";

import * as React from "react";
import {
  IconCategory,
  IconClipboard,
  IconFolders, IconLayoutDashboard,
  IconLock,
  IconPuzzle,
  IconUsers,
} from "@tabler/icons-react";

import { SidebarItems } from "~/components/sidebar/sidebar-items";
import { SidebarUser } from "~/components/sidebar/sidebar-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Projekte",
      url: "/dashboard/projects",
      icon: IconFolders,
    },
    {
      title: "Aufgaben",
      url: "/dashboard/tasks",
      icon: IconClipboard,
    },
  ],
  navAdmin: [
    {
      title: "Vorlagen",
      url: "/dashboard/templates",
      icon: IconCategory,
    },
    {
      title: "Benutzer",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Authentifizierungsmethoden",
      url: "/dashboard/authentication",
      icon: IconLock,
    },
  ],
};

export function SidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  if (!session) {
    redirect("/");
  }

  const [role] = api.user.getRole.useSuspenseQuery({
    id: Number(session.user?.id),
  });
  const isAdmin = role == "ADMINISTRATOR";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a className="hover:cursor-pointer">
                <IconPuzzle className="!size-5" />
                <span className="text-base font-semibold">Tasca</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItems items={data.navMain} />
        {isAdmin && (
          <SidebarItems title={"Administration"} items={data.navAdmin} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
