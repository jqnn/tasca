import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "~/server/db";
import { hybridAuthPlugin } from "~/server/better-auth/plugin/auth-plugin";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "mysql", // or "sqlite" or "mysql"
  }),

  plugins: [hybridAuthPlugin()],

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
      authMethodId: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

export type Session = typeof auth.$Infer.Session;
