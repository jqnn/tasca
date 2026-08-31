import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Benutzername</FieldLabel>
                <Input id="username" placeholder="joe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Passwort</FieldLabel>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Anmelden</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
