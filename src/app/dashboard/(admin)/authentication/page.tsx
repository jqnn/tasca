import {SiteHeader, SiteTitle} from "~/components/ui/site-header";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AuthenticationMethodsTable from "~/app/dashboard/(admin)/authentication/table";
import * as React from "react";

export default async function AuthenticationMethods() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const role = await api.user.getRole({id: Number(session.user.id)});
  if (role != "ADMINISTRATOR") {
    redirect("/");
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Authentifizierungsmethoden"} />
      </SiteHeader>

      <main className={"flex shrink-0 items-center gap-2 transition-[width,height] ease-linear"}>
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <AuthenticationMethodsTable/>
        </div>
      </main>
    </>
  );
}
