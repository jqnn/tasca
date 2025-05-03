import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import AuthenticationMethodsTable from "~/app/dashboard/(admin)/authentication/table";
import * as React from "react";
import { getTranslations } from "next-intl/server";

export default async function AuthenticationMethods() {
  const t = await getTranslations();
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={t("common.sidebar.authMethods")} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <AuthenticationMethodsTable />
        </div>
      </main>
    </>
  );
}
