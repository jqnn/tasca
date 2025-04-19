import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.templateInstance.findMany({
      include: {
        template: true,
      },
    });
  }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.templateInstance.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          FieldInstance: true,
          TaskInstance: true,
        },
      });
    }),
});
