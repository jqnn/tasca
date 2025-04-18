import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const templateTaskRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.templateTask.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        task: z.string(),
        description: z.string(),
        order: z.number(),
        templateId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.templateTask.create({
        data: {
          task: input.task,
          description: input.description,
          order: input.order,
          templateId: input.templateId,
        },
      });
    }),
});
