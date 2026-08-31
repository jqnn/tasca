import { redirect } from "next/navigation";
import { SetupForm } from "~/components/setup-form";
import { api } from "~/trpc/server";

export default async function SetupPage() {
  const exists = await api.setup.exists();
  if (exists) {
    redirect("/");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          {/*         <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <IconLayoutRows className="size-4" />
          </div>*/}
          <p>tasca</p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
