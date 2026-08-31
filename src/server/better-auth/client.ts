import { createAuthClient } from "better-auth/react";
import { hybridAuthPlugin } from "~/server/better-auth/plugin/auth-plugin";

export const authClient = createAuthClient({
  plugins: [hybridAuthPlugin()],
});

export type Session = typeof authClient.$Infer.Session;
