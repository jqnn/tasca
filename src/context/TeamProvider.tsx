"use client";

import type { Role, TeamRole } from "@prisma/client";
import { createContext, useContext, type ReactNode } from "react";

interface TeamType {
  TeamMember: {
    role: TeamRole;
    userId: number;
    teamId: number;
    joinedAt: Date;
  }[];
  createdBy: {
    id: number;
    userName: string;
    displayName: string | null;
    password: string | null;
    authMethodId: number;
    role: Role;
    createdAt: Date;
  };
}

const TeamContext = createContext<{ team: TeamType } | undefined>(
  undefined,
);

export const TeamProvider = ({
  project,
  children,
}: {
  project: TeamType;
  children: ReactNode;
}) => {
  return (
    <TeamContext.Provider value={{ team: project }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context)
    throw new Error("useTeam must be used within a TeamProvider");
  return context;
};
