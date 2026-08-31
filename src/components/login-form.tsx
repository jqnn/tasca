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

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type UserFormData = z.infer<typeof userSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(formData: UserFormData) {
    const { data, error } = await authClient.signInHybrid({
      username: formData.username,
      password: formData.password,
    });

    console.log(data, error);
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
                  <Button type="submit">Anmelden</Button>
                </Field>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
