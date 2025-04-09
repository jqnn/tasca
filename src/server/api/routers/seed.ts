import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/lib/utils";
import { env } from "~/env";

export const seedRouter = createTRPCRouter({
  createDefault: publicProcedure.query(async ({ ctx }) => {
    const exists = await ctx.db.authMethod.findFirst({
      where: { description: "local" },
    });
    if (exists != null) return false;

    const local = await ctx.db.authMethod.create({
      data: {
        description: "local",
        type: "LOCAL",
      },
    });

    const adminPassword = env.ADMIN_PASSWORD;
    if (adminPassword == null) return false;
    const hashedPassword = hashPassword(adminPassword);

    await ctx.db.user.create({
      data: {
        userName: "admin",
        displayName: "Administrator",
        password: hashedPassword,
        authMethodId: local.id,
        role: "ADMINISTRATOR",
      },
    });

    return true;
  }),
});
