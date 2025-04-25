"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

interface PageProps {
  teamId: number;
}

export function TeamNavigationComponent({ teamId }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const [role] = api.team.getRole.useSuspenseQuery({
    userId: Number(session.user?.id),
    teamId: teamId,
  });

  return (
    <NavigationMenu className={"ml-auto"}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href={`/dashboard/teams/${teamId}/`}
            className={navigationMenuTriggerStyle()}
          >
            Übersicht
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href={`/dashboard/teams/${teamId}/processes`}
            className={navigationMenuTriggerStyle()}
          >
            Prozesse
          </NavigationMenuLink>
        </NavigationMenuItem>

        {(role == "OWNER" || role == "ADMIN") && (
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/dashboard/teams/${teamId}/templates`}
              className={navigationMenuTriggerStyle()}
            >
              Vorlagen
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {role == "OWNER" && (
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/dashboard/teams/${teamId}/members`}
              className={navigationMenuTriggerStyle()}
            >
              Mitglieder
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
