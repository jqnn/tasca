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
  } | null;
  createdAt: Date;
  createdById: number | null;
  description: string | null;
  id: number;
  name: string;
  personal: boolean;
};

type TeamContextType = {
  team: TeamData;
  userRole: TeamRole;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({
  children,
  team,
  userRole,
}: {
  children: ReactNode;
  team: TeamData;
  userRole: TeamRole;
}) => {
  return (
    <TeamContext.Provider value={{ team, userRole }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context;
};
