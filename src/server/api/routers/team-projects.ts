import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const teamProjectsRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: { teamId: Number(input.id) },
      });
    }),

  find: publicProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({ where: { id: Number(input.id) },
      include: {
        ProjectTask: true
      }})
    }),
});
