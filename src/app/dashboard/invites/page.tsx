import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import * as React from "react";
import InviteList from "~/app/dashboard/invites/invite-list";
import { useTranslations } from "next-intl";

export default function Tasks() {
  const t = useTranslations()

  return (
    <>
      <SiteHeader>
        <SiteTitle title={t("common.sidebar.invites")} />
      </SiteHeader>

      <main className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <div className={"w-full"}>
            <InviteList />
          </div>
        </div>
      </main>
    </>
  );
}
