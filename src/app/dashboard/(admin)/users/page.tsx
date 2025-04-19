import { SiteHeader, SiteTitle } from "~/components/ui/site-header";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import UsersTable from "~/app/dashboard/(admin)/users/table";

export default async function Users() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <SiteHeader>
        <SiteTitle title={"Benutzer"} />
      </SiteHeader>

      <main
        className={
          "flex shrink-0 items-center gap-2 transition-[width,height] ease-linear"
        }
      >
        <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
          <UsersTable />
        </div>
      </main>
    </>
  );
}
