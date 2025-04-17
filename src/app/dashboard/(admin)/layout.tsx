import "~/styles/globals.css";

import { type ReactNode } from "react";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const role = await api.user.getRole({ id: Number(session.user.id) });
  if (role != "ADMINISTRATOR") {
    redirect("/");
  }

  return <>{children}</>;
}
