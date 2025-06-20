import { LoginForm } from "~/components/login-form";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard/teams");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1 className={"p-4 text-center text-xl font-bold"}>tasca</h1>

        <LoginForm />
      </div>
    </div>
  );
}
