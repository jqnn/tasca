import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
    findAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.project.findMany();
    }),
});
