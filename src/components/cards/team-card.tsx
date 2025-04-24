"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Role, TeamRole } from "@prisma/client";

interface PageProps {
  team: {
    TeamMember: {
      joinedAt: Date;
      role: TeamRole;
      teamId: number;
      userId: number;
    }[];
    createdBy: {
      authMethodId: number;
      createdAt: Date;
      displayName: string | null;
      id: number;
      password: string | null;
      role: Role;
      userName: string;
    };
  } & {
    createdAt: Date;
    createdById: number;
    description: string | null;
    id: number;
    name: string;
    personal: boolean;
  };
}

export function TeamCardComponent({ team }: PageProps) {
  const title = team.personal
    ? (team.createdBy.displayName ?? team.createdBy.userName)
    : team.name;

  const description = team.personal ? (
    <>
      <p>persönliches Projekt</p>
      <p>Aufgaben - 0</p>
    </>
  ) : (
    <>
      {team.description ? (
        <p>Beschreibung - {team.description}</p>
      ) : (
        <p>Mitglieder - {team.TeamMember.length}</p>
      )}
      <p>
        Besitzer -&nbsp;
        {team.createdBy.displayName ?? team.createdBy.userName}
      </p>
    </>
  );

  return (
    <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
