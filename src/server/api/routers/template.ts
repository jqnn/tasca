import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const templateRouter = createTRPCRouter({
    findAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.template.findMany();
    }),
});
