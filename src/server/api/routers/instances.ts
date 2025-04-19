import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ completed: z.boolean() }))
    .query(async ({ ctx, input }) => {
      if (input.completed) {
        return ctx.db.instanceTemplate.findMany({
          include: {
            template: true,
          },
        });
      } else {
        return ctx.db.instanceTemplate.findMany({
          where: { status: "OPEN" },
          include: {
            template: true,
          },
        });
      }
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.instanceTemplate.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          InstanceField: true,
          InstanceTask: true,
        },
      });
    }),
});
