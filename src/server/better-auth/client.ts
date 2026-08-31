import { createAuthClient } from "better-auth/react";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type { hybridAuthPlugin } from "~/server/better-auth/plugin/auth-plugin";

const hybridAuthClientPlugin = () =>
  ({
    id: "hybrid-ldap-auth",
    $InferServerPlugin: {} as ReturnType<typeof hybridAuthPlugin>,
  }) satisfies BetterAuthClientPlugin;

export const authClient = createAuthClient({
  plugins: [hybridAuthClientPlugin()],
});

export type Session = typeof authClient.$Infer.Session;
