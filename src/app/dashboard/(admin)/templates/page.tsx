import { SiteHeader } from "~/components/ui/site-header";
import { api } from "~/trpc/server";
import {auth} from "~/server/auth";
import {redirect} from "next/navigation";

export default async function Templates() {
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
        <SiteHeader title={"Vorlagen"}/>
      </>
  );
}
