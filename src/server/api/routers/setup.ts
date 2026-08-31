import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const setupRouter = createTRPCRouter({
  exists: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.db.user.findFirst()) === null;
  }),
});
