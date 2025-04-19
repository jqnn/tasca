import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.templateInstance.findMany();
  }),
});
