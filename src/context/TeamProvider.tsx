"use client";

import type { Role, TeamRole } from "@prisma/client";
import { createContext, type ReactNode, useContext } from "react";

type TeamData = {
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
  createdAt: Date;
  createdById: number;
  description: string | null;
  id: number;
  name: string;
  personal: boolean;
};

const TeamContext = createContext<{ team: TeamData } | undefined>(undefined);

export const TeamProvider = ({
  children,
  team,
}: {
  children: ReactNode;
  team: TeamData
}) => {
  return (
    <TeamContext.Provider value={{ team: team }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context.team;
};
