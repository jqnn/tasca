import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authMethodRouter = createTRPCRouter({
    findAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.authMethod.findMany();
        }),
});