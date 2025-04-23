import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      include: {
        ProjectMember: true,
      },
    });
  }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          createdBy: true,
          ProjectMember: true,
        },
      });
    }),
});
