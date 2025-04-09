import { SiteHeader } from "~/components/ui/site-header";
import { api } from "~/trpc/server";
import {auth} from "~/server/auth";
import {redirect} from "next/navigation";

export default async function Templates() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const isAdmin = await api.user.isAdmin({id: Number(session.user.id)})
  if(!(isAdmin)) {
    redirect("/");
  }

  return (
      <>
        <SiteHeader title={"Templates"}/>
      </>
  );
}
