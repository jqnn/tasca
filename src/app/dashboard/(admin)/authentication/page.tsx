import { SiteHeader } from "~/components/ui/site-header";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { DataTableDemo } from "~/app/dashboard/(admin)/authentication/table";

export default async function AuthenticationMethods() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const isAdmin = await api.user.isAdmin({ id: Number(session.user.id) });
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <>
      <SiteHeader title={"Authentifizierungsmethoden"} />
      <DataTableDemo />
    </>
  );
}
