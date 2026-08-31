"use client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup } from "~/components/ui/field";
import { ControlledInput } from "~/components/ui/controlled-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { authClient } from "~/server/better-auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type UserFormData = z.infer<typeof userSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(formData: UserFormData) {
    setLoading(true);
    toast.promise(
      async () => {
        const { data, error } = await authClient.$fetch("/sign-in/hybrid", {
          method: "POST",
          body: {
            username: formData.username,
            password: formData.password,
          },
        });

        if (error) {
          throw new Error(error.message || "Anmeldung fehlgeschlagen");
        }

        return data;
      },
      {
        loading: "Anmeldung läuft...",
        success: () => {
          router.push("/dashboard");
          return "Erfolgreich angemeldet!";
        },
        error: (err) => {
          return err.message || "Ein unerwarteter Fehler ist aufgetreten.";
        },
        finally: () => {
          setLoading(false);
        },
      },
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Anmelden</CardTitle>
          <CardDescription>
            Melde dich mit deinen Accountinformationen an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <ControlledInput
                  id="form-login-username"
                  name="username"
                  label="Benutzername"
                />

                <ControlledInput
                  id="form-login-password"
                  name="password"
                  label="Passwort"
                  type="password"
                />
                <Field>
                  <Button disabled={loading} type="submit">
                    Anmelden
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
