import { promisify } from "util";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exec } from "child_process";
import { auth } from "~/server/better-auth";
import { setupSchema } from "~/schemas/auth/setup";
import { TRPCError } from "@trpc/server";

const execAsync = promisify(exec);

export const setupRouter = createTRPCRouter({
  exists: publicProcedure.query(async ({ ctx }) => {
    const userCount = await ctx.db.user.count();
    return userCount > 0;
  }),

  setup: publicProcedure.input(setupSchema).mutation(async ({ input, ctx }) => {
    await execAsync("bunx --bun prisma migrate deploy");

    const existingUser = await ctx.db.user.findFirst();
    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Setup wurde bereits durchgeführt.",
      });
    }

    let localAuthMethod = await ctx.db.authMethod.findUnique({
      where: { description: "local" },
    });

    if (!localAuthMethod) {
      localAuthMethod = await ctx.db.authMethod.create({
        data: {
          description: "local",
          type: "LOCAL",
        },
      });
    }

    const res = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        authMethodId: localAuthMethod.id,
        username: input.username,
      },
    });

    if (!res?.user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Fehler beim Erstellen des Benutzers über Better Auth.",
      });
    }

    return {
      success: true,
      user: res.user,
    };
  }),
});
