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
import { api } from "~/trpc/react";
import { setupSchema, type SetupFormData } from "~/schemas/auth/setup";

export function SetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: "stoca Administrator",
      email: "",
      username: "admin",
      password: "",
    },
  });
  const setupMutation = api.setup.setup.useMutation();

  function onSubmit(formData: SetupFormData) {
    setLoading(true);

    toast.promise(setupMutation.mutateAsync(formData), {
      loading: "Erstellung läuft...",
      success: () => {
        router.push("/");
        return "Erfolgreich erstellt!";
      },
      error: (err) => {
        return err.message || "Ein unerwarteter Fehler ist aufgetreten.";
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Adminaccount erstellen</CardTitle>
          <CardDescription>Erstelle den Adminbenutzer.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <ControlledInput
                  id="form-setup-name"
                  name="name"
                  label="Name"
                />

                <ControlledInput
                  id="form-setup-email"
                  name="email"
                  label="Email"
                  type="email"
                />

                <ControlledInput
                  id="form-setup-username"
                  name="username"
                  label="Benutzername"
                />

                <ControlledInput
                  id="form-setup-password"
                  name="password"
                  label="Passwort"
                  type="password"
                />
                <Field>
                  <Button disabled={loading} type="submit">
                    Erstellen
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
