import {SiteHeader} from "~/components/ui/site-header";
import {auth} from "~/server/auth";
import {redirect} from "next/navigation";
import {api} from "~/trpc/server";
import UsersTable from "~/app/dashboard/(admin)/users/table";

export default async function Users() {
    const session = await auth();
    if (!session) {
        redirect("/");
    }

    const isAdmin = await api.user.isAdmin({id: Number(session.user.id)});
    if (!isAdmin) {
        redirect("/");
    }

    return (
        <>
            <SiteHeader title={"Benutzer"}/>
            <main className={"flex shrink-0 items-center gap-2 transition-[width,height] ease-linear"}>
                <div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
                    <UsersTable/>
                </div>
            </main>
        </>
    );
}
