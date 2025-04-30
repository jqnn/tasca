"use client";

import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SidebarItems({
  items,
  title = null,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  title?: string | null;
}) {
  const t = useTranslations();

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{t(title)}</SidebarGroupLabel>}

      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  {item.icon && <item.icon />}
                  <span>{t(item.title)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
