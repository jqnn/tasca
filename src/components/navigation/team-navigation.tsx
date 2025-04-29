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
import { Button } from "~/components/ui/button";
import { IconLogout, IconTrash } from "@tabler/icons-react";
import { DeleteDialog } from "~/components/dialogs/delete-dialog";
import { DeleteDialog as DeleteMemberDialog } from "~/components/dialogs/delete-team-member-dialog";

interface PageProps {
  teamId: number;
}

export function TeamNavigationComponent({ teamId }: PageProps) {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const deleteMutation = api.team.delete.useMutation();
  const removeMutation = api.teamMember.remove.useMutation();

  const [role] = api.teamMember.getRole.useSuspenseQuery({
    userId: Number(session.user?.id),
    teamId: teamId,
  });

  return (
    <NavigationMenu className={"ml-auto"}>
      <NavigationMenuList>
{/*        <NavigationMenuItem>
          <NavigationMenuLink
            href={`/dashboard/teams/${teamId}/`}
            className={navigationMenuTriggerStyle()}
          >
            Übersicht
          </NavigationMenuLink>
        </NavigationMenuItem>*/}
        <NavigationMenuItem>
          <NavigationMenuLink
            href={`/dashboard/teams/${teamId}/processes`}
            className={navigationMenuTriggerStyle()}
          >
            Prozesse
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href={`/dashboard/teams/${teamId}/projects`}
            className={navigationMenuTriggerStyle()}
          >
            Projekte
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

        <NavigationMenuItem>
          <Button variant={"destructive"} onClick={() => setShowModal(true)}>
            {role !== "OWNER" ? <IconLogout /> : <IconTrash />}
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>

      {showModal && (
        <>
          {role == "OWNER" ? (
            <DeleteDialog
              data={{ id: teamId }}
              mutation={deleteMutation}
              open={showModal}
              setOpen={setShowModal}
              loadingMessage={"Das Team wird gelöscht..."}
              successMessage={"Das Team wurde gelöscht."}
              onDelete={() => {
                router.push("/dashboard/teams");
              }}
            />
          ) : (
            <DeleteMemberDialog
              data={{ teamId: teamId, userId: Number(session.user.id) }}
              mutation={removeMutation}
              open={showModal}
              setOpen={setShowModal}
              loadingMessage={"Das Team wird verlassen..."}
              successMessage={"Das Team wurde verlassen."}
              onDelete={() => {
                router.push("/dashboard/teams");
              }}
            />
          )}
        </>
      )}
    </NavigationMenu>
  );
}
