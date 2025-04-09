import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

    await ctx.db.user.create({
      data: {
        userName: "admin",
        displayName: "Administrator",
        password: "test123",
        authMethodId: local.id,
        role: "ADMINISTRATOR",
      },
    });

    return true;
  }),
});
