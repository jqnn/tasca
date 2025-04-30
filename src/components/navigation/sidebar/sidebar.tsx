"use client";

import * as React from "react";
import {
  IconFolders,
  IconLock,
  IconMailOpened,
  IconPuzzle,
  IconUsers,
} from "@tabler/icons-react";

import { SidebarItems } from "~/components/navigation/sidebar/sidebar-items";
import { SidebarUser } from "~/components/navigation/sidebar/sidebar-user";
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
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";

const data = {
  navMain: [
    {
      title: "common.sidebar.teams",
      url: "/dashboard/teams",
      icon: IconFolders,
    },
    {
      title: "common.sidebar.invites",
      url: "/dashboard/invites",
      icon: IconMailOpened,
    },
  ],
  navAdmin: [
    {
      title: "common.sidebar.users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "common.sidebar.authMethods",
      url: "/dashboard/authentication",
      icon: IconLock,
    },
  ],
};

export function SidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
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
                <span className="text-base font-semibold">tasca</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItems items={data.navMain} />
        {isAdmin && (
          <SidebarItems title={"common.sidebar.admin"} items={data.navAdmin} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
